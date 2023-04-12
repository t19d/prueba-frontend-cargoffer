// models/product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String },
    size: { type: String },
    color: { type: String },
    material: { type: String },
    brand: { type: String },
    stock: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
