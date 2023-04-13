const jwt = require('jsonwebtoken');
require('dotenv').config();

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const data = require('../example/fake-data');

/**
 * Authentication middleware
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 * @returns {undefined}
 * @throws {Error} - If token is missing or invalid
 * @description This middleware function verifies the access token received in the Authorization header of the request,
 * and stores the user information contained in the token in the request object for further use in subsequent middleware or routes.
 */
const authMiddleware = (req, res, next) => {
    // Get token from request header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verify token with secret key
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Store user information in request
        req.user = decoded;

        // Continue with the next middleware function
        next();
    } catch (err) {
        // Handle invalid token error
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// #region GET

/**
 * Get all products
 *
 * @route GET /api/products
 * @group Products - Operations about product
 * @returns {Array.<Product>} 200 - An array of all products
 * @returns {Error} 500 - Internal server error
 */
router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Get a product by ID
 *
 * @route GET /api/products/:id
 * @group Products - Operations about product
 * @param {string} id.path.required - Product ID
 * @returns {Product.model} 200 - The requested product
 * @returns {Error} 400 - Invalid ID provided
 * @returns {Error} 404 - Product not found
 * @returns {Error} 500 - Internal server error
 */
router.get('/:id', async (req, res, next) => {
    const id = req.params.id;

    // Validate the product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID provided' });
    }

    // Find the product by its ID
    try {
        const product = await Product.findById(id);

        // Check if the product was found
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Return the product
        res.json(product);
    } catch (err) {
        // Return an error if something goes wrong
        res.status(500).json({ error: err.message });
    }
});

// #endregion

// #region PUT

/**
 * Update a product by ID
 *
 * @route PUT /api/products/:id
 * @group Products - Operations about product
 * @param {string} id.path.required - Product ID
 * @param {Object} req.body - Request body with product fields to update
 * @returns {Object} 200 - Updated product
 * @returns {Error} 400 - Invalid ID provided
 * @returns {Error} 500 - Internal server error
 */
router.put('/:id', authMiddleware, async (req, res, next) => {
    const id = req.params.id;

    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: 'The provided ID is not valid'
        });
    }

    try {
        const product = await Product.findById(id);

        if (!product)
            return res.status(404).json({ error: 'Product not found' });

        // Update product fields with request body
        for (const [key, value] of Object.entries(req.body)) {
            if (value === null) {
                product[key] = key === 'stock' ? 0 : undefined;
            } else {
                product[key] = value;
            }
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// #endregion

// #region POST

/**
 * Create a new product
 *
 * @route POST /api/products
 * @group Products - Operations about product
 * @param {object} product.body.required - The product object to be created
 * @returns {object} 201 - The newly created product object
 * @returns {Error} 400 - Invalid or missing product fields
 * @returns {Error} 500 - Internal server error
 */
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const productData = req.body;
        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

/**
 * Endpoint to seed fake data in the database
 *
 * @name POST /seed-fake-data
 * @function
 * @memberof module:routers/products~productsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Array.<Product>} 200 The created products.
 * @returns {Error} 500 - If something goes wrong during the database operation.
 */
router.post('/seed-fake-data', authMiddleware, async (req, res, next) => {
    try {
        // Delete all existing products
        await Product.deleteMany({});
        // Insert new products
        const createdProducts = await Product.insertMany(data);
        res.status(200).json(createdProducts);
    } catch (err) {
        // Return error if something goes wrong
        res.status(500).json({ error: err.message });
    }
});

// #endregion

// #region DELETE

/**
 * Delete a product by ID
 *
 * @route DELETE /api/products/:id
 * @group Products - Operations about product
 * @param {string} id.path.required - Product ID
 * @returns {Object} 200 - Deleted product
 * @returns {Error} 400 - Invalid ID provided
 * @returns {Error} 404 - Product not found
 * @returns {Error} 500 - Internal server error
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
    const id = req.params.id;

    // Check if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            error: 'The provided ID is not valid'
        });
    }

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// #endregion

/**
 * Middleware function to handle errors
 *
 * @param {Object} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
router.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            message: err.message
        }
    });
});

module.exports = router;
