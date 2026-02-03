const express = require('express');
const WishlistController = require('../controllers/wishlistController');

const router = express.Router();

/**
 * Wishlist Routes (BONUS FEATURE)
 * Base path: /api/wishlist
 */

// GET /api/wishlist - Get user's wishlist
router.get('/', WishlistController.getWishlist);

// POST /api/wishlist - Add to wishlist
router.post('/', WishlistController.addToWishlist);

// DELETE /api/wishlist/:productId - Remove from wishlist
router.delete('/:productId', WishlistController.removeFromWishlist);

module.exports = router;
