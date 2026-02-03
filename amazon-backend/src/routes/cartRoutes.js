const express = require('express');
const CartController = require('../controllers/cartController');
const Validator = require('../middleware/validator');

const router = express.Router();

/**
 * Cart Routes
 * Base path: /api/cart
 */

// GET /api/cart - Get user's cart
router.get('/', CartController.getCart);

// POST /api/cart - Add item to cart
router.post('/', Validator.validateCartItem, CartController.addToCart);

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', CartController.updateCartItem);

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', CartController.removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete('/', CartController.clearCart);

module.exports = router;
