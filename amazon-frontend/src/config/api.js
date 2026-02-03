import axios from 'axios';

// API Base URL - Update this to match your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://amazon-clone-agp5.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for API calls
api.interceptors.request.use((config) => {
  // Only add user_id to requests that actually have a body
  if (['post', 'put', 'patch'].includes(config.method) && config.data) {
    if (!config.data.user_id) {
      config.data.user_id = 1;
    }
  }
  return config;
});

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const productAPI = {
  // Get all products with optional filters
  getProducts: (params = {}) => {
    return api.get('/products', { params });
  },
  
  // Get single product details
  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },
  
  // Search products
  searchProducts: (query, params = {}) => {
    return api.get('/products/search', { 
      params: { q: query, ...params } 
    });
  },
};

export const cartAPI = {
  // Get user's cart
  getCart: () => {
    return api.get('/cart');
  },
  
  // Add item to cart
  addToCart: (productId, quantity = 1) => {
    return api.post('/cart', { product_id: productId, quantity });
  },
  
  // Update cart item quantity
  updateCartItem: (productId, quantity) => {
    return api.put(`/cart/${productId}`, { quantity });
  },
  
  // Remove item from cart
  removeFromCart: (productId) => {
    return api.delete(`/cart/${productId}`);
  },
  
  // Clear entire cart
  clearCart: () => {
    return api.delete('/cart');
  },
};

export const orderAPI = {
  // Get user's order history
  getOrders: () => {
    return api.get('/orders');
  },
  
  // Get specific order details
  getOrderById: (id) => {
    return api.get(`/orders/${id}`);
  },
  
  // Place new order
  placeOrder: (shippingAddress) => {
    return api.post('/orders', { shipping_address: shippingAddress });
  },
};

export const wishlistAPI = {
  // Get user's wishlist
  getWishlist: () => {
    return api.get('/wishlist');
  },
  
  // Add item to wishlist
  addToWishlist: (productId) => {
    return api.post('/wishlist', { product_id: productId });
  },
  
  // Remove item from wishlist
  removeFromWishlist: (productId) => {
    return api.delete(`/wishlist/${productId}`);
  },
};

export const categoryAPI = {
  // Get all categories
  getCategories: () => {
    return api.get('/categories');
  },
};

export default api;
