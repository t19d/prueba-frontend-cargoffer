const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const express = require('express');
const router = express.Router();
const User = require('../models/user');

/**
 * Log in a user
 *
 * @route POST /api/users/login
 * @group Users - Operations about user
 * @param {object} credentials.body.required - The user's credentials object {username, password}
 * @returns {object} 200 - The user's access token
 * @returns {Error} 400 - Invalid or missing username or password
 * @returns {Error} 401 - Invalid credentials
 */
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: 'Username and password are required' });
        }

        // Find user by username
        const user = await User.findOne({ username });

        // Check if user exists
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create and send access token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET
        );
        res.json({ accessToken });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Add a new user
 *
 * @route POST /api/users
 * @group Users - Operations about user
 * @param {object} user.body.required - The user object to be added
 * @returns {object} 201 - The newly added user object
 * @returns {Error} 400 - Invalid or missing user fields
 * @returns {Error} 500 - Internal server error
 */
router.post('/', async (req, res, next) => {
    try {
        const userData = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        const newUser = new User(userData);
        await newUser.save();
        res.status(201).json({ username: newUser.username });
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

/**
 * Update an existing user
 *
 * @route PUT /api/users/:id
 * @group Users - Operations about user
 * @param {string} id.path.required - The ID of the user to be updated
 * @param {object} user.body.required - The user object with updated fields
 * @returns {object} 200 - The updated user object
 * @returns {Error} 400 - Invalid or missing user fields
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Internal server error
 */
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const userData = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, userData, {
            new: true,
            runValidators: true
        });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

/**
 * Delete a user
 *
 * @route DELETE /api/users/:id
 * @group Users - Operations about user
 * @param {string} id.path.required - The ID of the user to be deleted
 * @returns {object} 204 - No content
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Internal server error
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
