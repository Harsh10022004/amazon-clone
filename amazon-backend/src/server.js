require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Middleware
const attachUser = require('./middleware/attachUser');
const errorHandler = require('./middleware/errorHandler');

// Routes
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
// CORS Configuration (for frontend integration)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://amazon-clone-pi-snowy-74.vercel.app/',
  credentials: true
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach default user (Assignment requirement: no login needed)
app.use(attachUser);

// Serve Static Images from amazon_images (moved to public/images)
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/gems', express.static(path.join(__dirname, '../public/gems')));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==================== ROUTES ====================
// Health Check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Amazon Clone API is running',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
      orders: '/api/orders',
      wishlist: '/api/wishlist'
    }
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global Error Handler (must be last)
app.use(errorHandler);

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   🚀 AMAZON CLONE BACKEND SERVER RUNNING      ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log(`\n📍 Server: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/\n`);
  console.log('✅ All systems operational!\n');
});

module.exports = app;
