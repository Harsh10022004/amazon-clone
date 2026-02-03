const express = require('express');
const ProductController = require('../controllers/productController');
const Validator = require('../middleware/validator');

const router = express.Router();

/**
 * Product Routes
 * Base path: /api/products
 */

// GET /api/products - Get all products (with search & filter)
router.get('/', ProductController.getAllProducts);

// GET /api/products/:id - Get product details
router.get('/:id', Validator.validateProductId, ProductController.getProductById);

module.exports = router;
