const db = require('../config/database');
const AppError = require('../utils/AppError');

/**
 * Wishlist Service Layer (BONUS FEATURE)
 * Handles wishlist operations
 */
class WishlistService {
  /**
   * Get user's wishlist
   */
  static async getWishlist(userId) {
    const [items] = await db.query(
      `SELECT 
        wi.id as wishlist_item_id,
        p.id as product_id,
        p.title,
        p.price,
        p.rating,
        p.stock_quantity,
        (SELECT image_url FROM ProductImages WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image,
        wi.created_at
      FROM WishlistItems wi
      INNER JOIN Products p ON wi.product_id = p.id
      WHERE wi.user_id = ?
      ORDER BY wi.created_at DESC`,
      [userId]
    );
    
    return items;
  }

  /**
   * Add product to wishlist
   */
  static async addToWishlist(userId, productId) {
    // Check if product exists
    const [products] = await db.query('SELECT id FROM Products WHERE id = ?', [productId]);
    if (products.length === 0) {
      throw new AppError('Product not found', 404);
    }
    
    try {
      const [result] = await db.query(
        'INSERT INTO WishlistItems (user_id, product_id) VALUES (?, ?)',
        [userId, productId]
      );
      return { message: 'Added to wishlist', wishlist_item_id: result.insertId };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('Product already in wishlist', 400);
      }
      throw error;
    }
  }

  /**
   * Remove product from wishlist
   */
  static async removeFromWishlist(userId, productId) {
    const [result] = await db.query(
      'DELETE FROM WishlistItems WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    
    if (result.affectedRows === 0) {
      throw new AppError('Item not found in wishlist', 404);
    }
    
    return { message: 'Removed from wishlist' };
  }
}

module.exports = WishlistService;
