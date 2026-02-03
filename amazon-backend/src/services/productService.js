const db = require('../config/database');
const AppError = require('../utils/AppError');

/**
 * Product Service Layer
 * Handles all product-related business logic and database operations
 */
class ProductService {
  /**
   * Get all products with optional search and category filter
   */
  static async getAllProducts(search = null, category = null) {
    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        (SELECT image_url FROM ProductImages WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Search filter
    if (search && search.trim()) {
      query += ` AND (p.title LIKE ? OR p.description LIKE ?)`;
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }
    
    // Category filter
    if (category && category.trim()) {
      query += ` AND c.name = ?`;
      params.push(category.trim());
    }
    
    query += ` ORDER BY p.created_at DESC`;
    
    const [products] = await db.query(query, params);
    return products;
  }

  /**
   * Get single product by ID with all images (for carousel)
   */
  static async getProductById(id) {
    const [products] = await db.query(
      `SELECT 
        p.*,
        c.name as category_name
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      WHERE p.id = ?`,
      [id]
    );
    
    if (products.length === 0) {
      throw new AppError('Product not found', 404);
    }
    
    const product = products[0];
    
    // Get all images for carousel
    const [images] = await db.query(
      `SELECT image_url, is_primary, display_order 
       FROM ProductImages 
       WHERE product_id = ? 
       ORDER BY display_order ASC`,
      [id]
    );
    
    product.images = images;
    
    // Parse JSON specifications
    if (product.specifications) {
      try {
        product.specifications = JSON.parse(product.specifications);
      } catch (e) {
        product.specifications = {};
      }
    }
    
    return product;
  }

  /**
   * Get all categories
   */
  static async getAllCategories() {
    const [categories] = await db.query('SELECT * FROM Categories ORDER BY name ASC');
    return categories;
  }

  /**
   * Check if product has sufficient stock
   */
  static async checkStock(productId, quantity) {
    const [products] = await db.query(
      'SELECT stock_quantity FROM Products WHERE id = ?',
      [productId]
    );
    
    if (products.length === 0) {
      throw new AppError('Product not found', 404);
    }
    
    return products[0].stock_quantity >= quantity;
  }
}

module.exports = ProductService;
