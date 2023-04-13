require('./database/mongodb');

const express = require('express');
const app = express();
const PORT = 3000;

// #region Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

// #endregion

// #region Products
const productsRouter = require('./routes/products');
app.use('/products', productsRouter);
// #endregion

// #region Users
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
// #endregion

app.listen(PORT, (error) => {
    if (!error) console.log(`Server is Successfully running on port ${PORT}`);
    else console.log("Error occurred, server can't start", error);
});
