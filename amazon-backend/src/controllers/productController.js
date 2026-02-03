const ProductService = require('../services/productService');
const ResponseFormatter = require('../utils/responseFormatter');
const catchAsync = require('../utils/catchAsync');

/**
 * Product Controller
 * Handles HTTP requests for product-related operations
 */
class ProductController {
  /**
   * GET /api/products
   * Get all products with optional search and category filter
   */
  static getAllProducts = catchAsync(async (req, res) => {
    const { search, category } = req.query;
    
    const products = await ProductService.getAllProducts(search, category);
    
    return ResponseFormatter.success(
      res,
      products,
      `Found ${products.length} product(s)`
    );
  });

  /**
   * GET /api/products/:id
   * Get single product with all details
   */
  static getProductById = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const product = await ProductService.getProductById(id);
    
    return ResponseFormatter.success(res, product);
  });

  /**
   * GET /api/categories
   * Get all categories
   */
  static getAllCategories = catchAsync(async (req, res) => {
    const categories = await ProductService.getAllCategories();
    
    return ResponseFormatter.success(res, categories);
  });
}

module.exports = ProductController;
