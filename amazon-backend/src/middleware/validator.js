const AppError = require('../utils/AppError');

/**
 * Input Validation Middleware
 */
class Validator {
  static validateProductId(req, res, next) {
    const { id } = req.params;
    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return next(new AppError('Invalid product ID', 400));
    }
    req.params.id = parseInt(id);
    next();
  }

  static validateCartItem(req, res, next) {
    const { product_id, quantity } = req.body;
    
    if (!product_id || isNaN(product_id) || parseInt(product_id) <= 0) {
      return next(new AppError('Invalid product ID', 400));
    }
    
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      return next(new AppError('Quantity must be a positive number', 400));
    }
    
    next();
  }

  static validateOrderPlacement(req, res, next) {
    const { shipping_address } = req.body;
    
    if (!shipping_address || shipping_address.trim().length < 10) {
      return next(new AppError('Valid shipping address is required (minimum 10 characters)', 400));
    }
    
    next();
  }
}

module.exports = Validator;
