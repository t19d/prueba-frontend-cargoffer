require('./database/mongodb');

const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

// #region Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configurar CORS
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Authorization', 'Content-Type']
    })
);

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
