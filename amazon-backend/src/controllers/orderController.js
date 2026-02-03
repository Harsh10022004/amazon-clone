const OrderService = require('../services/orderService');
const ResponseFormatter = require('../utils/responseFormatter');
const catchAsync = require('../utils/catchAsync');

/**
 * Order Controller
 * Handles HTTP requests for order operations
 */
class OrderController {
  /**
   * POST /api/orders
   * Place a new order from cart items
   */
  static placeOrder = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { shipping_address } = req.body;
    
    const order = await OrderService.placeOrder(userId, shipping_address);
    
    return ResponseFormatter.success(res, order, order.message, 201);
  });

  /**
   * GET /api/orders
   * Get user's order history (BONUS FEATURE)
   */
  static getOrderHistory = catchAsync(async (req, res) => {
    const userId = req.user.id;
    
    const orders = await OrderService.getOrderHistory(userId);
    
    return ResponseFormatter.success(
      res,
      orders,
      `Found ${orders.length} order(s)`
    );
  });

  /**
   * GET /api/orders/:id
   * Get single order details
   */
  static getOrderById = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    
    const order = await OrderService.getOrderById(userId, id);
    
    return ResponseFormatter.success(res, order);
  });
}

module.exports = OrderController;
