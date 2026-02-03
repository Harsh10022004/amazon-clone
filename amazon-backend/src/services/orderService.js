const db = require('../config/database');
const AppError = require('../utils/AppError');
const NotificationService = require('./notificationService');

/**
 * Order Service Layer
 * Handles complex order placement logic with transactions
 */
class OrderService {
  /**
   * Place order from cart items
   * Uses database transactions to ensure data consistency
   */
  static async placeOrder(userId, shippingAddress) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 1. Fetch cart items
      const [cartItems] = await connection.query(
        `SELECT ci.product_id, ci.quantity, p.price, p.stock_quantity, p.title
         FROM CartItems ci
         INNER JOIN Products p ON ci.product_id = p.id
         WHERE ci.user_id = ?
         FOR UPDATE`, // Lock rows for update
        [userId]
      );
      
      if (cartItems.length === 0) {
        throw new AppError('Cart is empty', 400);
      }
      
      // 2. Validate stock availability
      for (const item of cartItems) {
        if (item.stock_quantity < item.quantity) {
          throw new AppError(
            `Insufficient stock for "${item.title}". Only ${item.stock_quantity} available.`,
            400
          );
        }
      }
      
      // 3. Calculate total
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );
      
      // 4. Create order
      const [orderResult] = await connection.query(
        `INSERT INTO Orders (user_id, total_amount, status, shipping_address) 
         VALUES (?, ?, 'confirmed', ?)`,
        [userId, totalAmount, shippingAddress]
      );
      
      const orderId = orderResult.insertId;
      
      // 5. Create order items and update stock
      for (const item of cartItems) {
        // Insert order item
        await connection.query(
          `INSERT INTO OrderItems (order_id, product_id, quantity, price_at_purchase) 
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price]
        );
        
        // Decrease stock
        await connection.query(
          'UPDATE Products SET stock_quantity = stock_quantity - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }
      
      // 6. Clear cart
      await connection.query('DELETE FROM CartItems WHERE user_id = ?', [userId]);
      
      // 7. Commit transaction
      await connection.commit();
      
      // 8. Send notification (async, outside transaction)
      const [users] = await db.query('SELECT email FROM Users WHERE id = ?', [userId]);
      if (users.length > 0) {
        NotificationService.sendOrderConfirmation(users[0].email, orderId, totalAmount);
      }
      
      return {
        order_id: orderId,
        total_amount: parseFloat(totalAmount.toFixed(2)),
        status: 'confirmed',
        message: 'Order placed successfully'
      };
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Get user's order history
   */
  static async getOrderHistory(userId) {
    const [orders] = await db.query(
      `SELECT 
        id, total_amount, status, shipping_address, created_at
      FROM Orders
      WHERE user_id = ?
      ORDER BY created_at DESC`,
      [userId]
    );
    
    // Get items for each order
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT 
          oi.quantity, oi.price_at_purchase,
          p.title, p.id as product_id,
          (SELECT image_url FROM ProductImages WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
        FROM OrderItems oi
        INNER JOIN Products p ON oi.product_id = p.id
        WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }
    
    return orders;
  }

  /**
   * Get single order details
   */
  static async getOrderById(userId, orderId) {
    const [orders] = await db.query(
      `SELECT * FROM Orders WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );
    
    if (orders.length === 0) {
      throw new AppError('Order not found', 404);
    }
    
    const order = orders[0];
    
    const [items] = await db.query(
      `SELECT 
        oi.quantity, oi.price_at_purchase,
        p.title, p.id as product_id,
        (SELECT image_url FROM ProductImages WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
      FROM OrderItems oi
      INNER JOIN Products p ON oi.product_id = p.id
      WHERE oi.order_id = ?`,
      [orderId]
    );
    
    order.items = items;
    return order;
  }
}

module.exports = OrderService;
