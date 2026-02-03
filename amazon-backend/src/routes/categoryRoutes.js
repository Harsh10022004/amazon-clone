const express = require('express');
const ProductController = require('../controllers/productController');

const router = express.Router();

/**
 * Category Routes
 * Base path: /api/categories
 */

// GET /api/categories - Get all categories
router.get('/', ProductController.getAllCategories);

module.exports = router;
