const WishlistService = require('../services/wishlistService');
const ResponseFormatter = require('../utils/responseFormatter');
const catchAsync = require('../utils/catchAsync');

/**
 * Wishlist Controller (BONUS FEATURE)
 * Handles HTTP requests for wishlist operations
 */
class WishlistController {
  /**
   * GET /api/wishlist
   * Get user's wishlist
   */
  static getWishlist = catchAsync(async (req, res) => {
    const userId = req.user.id;
    
    const items = await WishlistService.getWishlist(userId);
    
    return ResponseFormatter.success(
      res,
      items,
      `Found ${items.length} item(s) in wishlist`
    );
  });

  /**
   * POST /api/wishlist
   * Add product to wishlist
   */
  static addToWishlist = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { product_id } = req.body;
    
    const result = await WishlistService.addToWishlist(userId, product_id);
    
    return ResponseFormatter.success(res, result, result.message, 201);
  });

  /**
   * DELETE /api/wishlist/:productId
   * Remove product from wishlist
   */
  static removeFromWishlist = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;
    
    const result = await WishlistService.removeFromWishlist(userId, productId);
    
    return ResponseFormatter.success(res, result, result.message);
  });
}

module.exports = WishlistController;
