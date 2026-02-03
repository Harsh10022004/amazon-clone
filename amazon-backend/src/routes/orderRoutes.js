const express = require('express');
const OrderController = require('../controllers/orderController');
const Validator = require('../middleware/validator');

const router = express.Router();

/**
 * Order Routes
 * Base path: /api/orders
 */

// POST /api/orders - Place order
router.post('/', Validator.validateOrderPlacement, OrderController.placeOrder);

// GET /api/orders - Get order history (BONUS)
router.get('/', OrderController.getOrderHistory);

// GET /api/orders/:id - Get order details
router.get('/:id', OrderController.getOrderById);

module.exports = router;
