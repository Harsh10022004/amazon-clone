const CartService = require('../services/cartService');
const ResponseFormatter = require('../utils/responseFormatter');
const catchAsync = require('../utils/catchAsync');

/**
 * Cart Controller
 * Handles HTTP requests for shopping cart operations
 */
class CartController {
  /**
   * GET /api/cart
   * Get user's cart
   */
  static getCart = catchAsync(async (req, res) => {
    const userId = req.user.id;
    
    const cart = await CartService.getCart(userId);
    
    return ResponseFormatter.success(res, cart);
  });

  /**
   * POST /api/cart
   * Add item to cart
   */
  static addToCart = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;
    
    const result = await CartService.addToCart(userId, product_id, quantity);
    
    return ResponseFormatter.success(res, result, result.message, 201);
  });

  /**
   * PUT /api/cart/:id
   * Update cart item quantity
   */
  static updateCartItem = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;
    
    const result = await CartService.updateCartItem(userId, id, quantity);
    
    return ResponseFormatter.success(res, result, result.message);
  });

  /**
   * DELETE /api/cart/:id
   * Remove item from cart
   */
  static removeFromCart = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    
    const result = await CartService.removeFromCart(userId, id);
    
    return ResponseFormatter.success(res, result, result.message);
  });

  /**
   * DELETE /api/cart
   * Clear entire cart
   */
  static clearCart = catchAsync(async (req, res) => {
    const userId = req.user.id;
    
    const result = await CartService.clearCart(userId);
    
    return ResponseFormatter.success(res, result, result.message);
  });
}

module.exports = CartController;
