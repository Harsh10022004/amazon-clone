const db = require('../config/database');
const AppError = require('../utils/AppError');

/**
 * Cart Service Layer
 * Handles all shopping cart operations
 */
class CartService {
  /**
   * Get user's cart with product details
   */
  static async getCart(userId) {
    const [cartItems] = await db.query(
      `SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        p.id as product_id,
        p.title,
        p.price,
        p.stock_quantity,
        (SELECT image_url FROM ProductImages WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM CartItems ci
      INNER JOIN Products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC`,
      [userId]
    );
    
    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      items: cartItems,
      summary: {
        item_count: itemCount,
        subtotal: parseFloat(subtotal.toFixed(2)),
        total: parseFloat(subtotal.toFixed(2)) // Can add tax/shipping here
      }
    };
  }

  /**
   * Add product to cart (or update quantity if exists)
   */
  static async addToCart(userId, productId, quantity) {
    // Check if product exists and has stock
    const [products] = await db.query(
      'SELECT id, stock_quantity, title FROM Products WHERE id = ?',
      [productId]
    );
    
    if (products.length === 0) {
      throw new AppError('Product not found', 404);
    }
    
    if (products[0].stock_quantity < quantity) {
      throw new AppError(`Only ${products[0].stock_quantity} items available in stock`, 400);
    }
    
    // Check if item already in cart
    const [existingItems] = await db.query(
      'SELECT id, quantity FROM CartItems WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    
    if (existingItems.length > 0) {
      // Update quantity
      const newQuantity = existingItems[0].quantity + quantity;
      
      if (products[0].stock_quantity < newQuantity) {
        throw new AppError(`Only ${products[0].stock_quantity} items available in stock`, 400);
      }
      
      await db.query(
        'UPDATE CartItems SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newQuantity, existingItems[0].id]
      );
      
      return { message: 'Cart updated', cart_item_id: existingItems[0].id };
    } else {
      // Insert new item
      const [result] = await db.query(
        'INSERT INTO CartItems (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
      
      return { message: 'Item added to cart', cart_item_id: result.insertId };
    }
  }

  /**
   * Update cart item quantity by product_id
   */
  static async updateCartItem(userId, productId, quantity) {
    if (quantity <= 0) {
      throw new AppError('Quantity must be positive', 400);
    }
    
    // Verify cart item belongs to user and check stock
    const [items] = await db.query(
      `SELECT ci.id, p.stock_quantity 
       FROM CartItems ci
       INNER JOIN Products p ON ci.product_id = p.id
       WHERE ci.product_id = ? AND ci.user_id = ?`,
      [productId, userId]
    );
    
    if (items.length === 0) {
      throw new AppError('Cart item not found', 404);
    }
    
    if (items[0].stock_quantity < quantity) {
      throw new AppError(`Only ${items[0].stock_quantity} items available in stock`, 400);
    }
    
    await db.query(
      'UPDATE CartItems SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [quantity, items[0].id]
    );
    
    return { message: 'Cart updated' };
  }

  /**
   * Remove item from cart by product_id
   */
  static async removeFromCart(userId, productId) {
    const [result] = await db.query(
      'DELETE FROM CartItems WHERE product_id = ? AND user_id = ?',
      [productId, userId]
    );
    
    if (result.affectedRows === 0) {
      throw new AppError('Cart item not found', 404);
    }
    
    return { message: 'Item removed from cart' };
  }

  /**
   * Clear entire cart
   */
  static async clearCart(userId) {
    await db.query('DELETE FROM CartItems WHERE user_id = ?', [userId]);
    return { message: 'Cart cleared' };
  }
}

module.exports = CartService;
