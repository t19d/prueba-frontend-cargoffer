const express = require('express');

const app = express();
const PORT = 3000;

// Importamos la conexión a la base de datos
require('./database/mongodb');

// #region Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// #endregion

// #region Products

// Definimos nuestras rutas
const productsRouter = require('./routes/products');
app.use('/products', productsRouter);
// #endregion

app.listen(PORT, (error) => {
    if (!error) console.log(`Server is Successfully running on port ${PORT}`);
    else console.log("Error occurred, server can't start", error);
});
