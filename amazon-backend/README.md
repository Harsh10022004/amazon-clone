# Amazon Clone Backend

**SDE Intern Full-Stack Assignment**

A production-ready e-commerce backend built with Node.js, Express, and MySQL, featuring a clean 3-layer architecture with comprehensive product management, shopping cart, order processing, and wishlist functionality.

---

## 🚀 Tech Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: MySQL 8.0+
- **Architecture**: 3-Layer (Controller → Service → Database)
- **Environment**: dotenv for configuration
- **Dev Tools**: Nodemon for hot reloading

---

## 📁 Project Structure

```
amazon-backend/
├── database/
│   ├── schema.sql              # Database schema with foreign keys
│   └── seed.js                 # Sample data seeder
├── src/
│   ├── config/
│   │   └── database.js         # MySQL connection pool
│   ├── controllers/            # HTTP request handlers
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── wishlistController.js
│   ├── services/               # Business logic layer
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   ├── orderService.js
│   │   ├── wishlistService.js
│   │   └── notificationService.js
│   ├── middleware/
│   │   ├── attachUser.js       # Auth bypass (default user)
│   │   ├── errorHandler.js     # Global error handler
│   │   └── validator.js        # Input validation
│   ├── routes/                 # API route definitions
│   ├── utils/                  # Helper functions
│   └── server.js               # Application entry point
├── .env                        # Environment variables
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- MySQL 8.0+ running locally
- Git

### 2. Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd amazon-backend

# Install dependencies
npm install
```

### 3. Database Configuration

Edit `.env` file and update MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password_here  # ⚠️ UPDATE THIS!
DB_NAME=amazon_clone
DB_PORT=3306
PORT=5000
```

### 4. Seed Database

```bash
npm run seed
```

**Expected Output:**
```
✓ Database connected successfully
✓ Tables created
✓ Inserted 1 user
✓ Inserted 3 categories
✓ Inserted 12 products with images
🎉 Database seeding completed!
```

### 5. Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Server will start at:** `http://localhost:5000`

---

## 📚 API Endpoints

### Products
- `GET /api/products` - Get all products (supports `?search=query&category=name`)
- `GET /api/products/:id` - Get product details with images
- `GET /api/categories` - Get all categories

### Shopping Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
  - Body: `{ "product_id": 1, "quantity": 2 }`
- `PUT /api/cart/:id` - Update cart item quantity
  - Body: `{ "quantity": 3 }`
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Place order
  - Body: `{ "shipping_address": "123 Main St..." }`
- `GET /api/orders` - Get order history *(Bonus)*
- `GET /api/orders/:id` - Get order details

### Wishlist *(Bonus Feature)*
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
  - Body: `{ "product_id": 1 }`
- `DELETE /api/wishlist/:productId` - Remove from wishlist

**📖 For detailed testing commands, see [TESTING.md](TESTING.md)**

---

## 🎯 Core Features

### ✅ Implemented (Required)
- [x] Product Listing with Search & Category Filter
- [x] Product Detail Page with Image Carousel Support
- [x] Shopping Cart (Add, Update, Remove)
- [x] Order Placement with Transaction Handling
- [x] Order Confirmation & Order ID

### ⭐ Bonus Features
- [x] Wishlist Functionality
- [x] Order History
- [x] Email Notification (Mock)
- [x] Comprehensive Database Design
- [x] Input Validation
- [x] Global Error Handling
- [x] CORS Enabled for Frontend

---

## 🗄️ Database Schema

### Key Tables
- **Users**: Customer information
- **Categories**: Product categories
- **Products**: Product details with JSON specifications
- **ProductImages**: Multiple images per product (carousel)
- **CartItems**: Shopping cart
- **WishlistItems**: User wishlists *(Bonus)*
- **Orders**: Order records
- **OrderItems**: Order line items

**See `database/schema.sql` for complete schema.**

---

## 🏗️ Architecture

### 3-Layer Design

1. **Controller Layer**: Handles HTTP requests, validates input
2. **Service Layer**: Contains business logic, database operations
3. **Route Layer**: Defines API endpoints

### Key Design Patterns
- **Separation of Concerns**: No SQL in controllers
- **Transaction Management**: Orders use database transactions
- **Error Handling**: Centralized error handler
- **Response Standardization**: Consistent JSON format

---

## 🔒 Assumptions

1. **No Authentication Required**: Default user (ID: 1) is always logged in per assignment requirements
2. **Single Currency**: All prices in USD
3. **Stock Management**: Order placement reduces stock automatically
4. **Email Notifications**: Mock implementation (console.log)

---

## 🧪 Testing

Refer to **[TESTING.md](TESTING.md)** for:
- Step-by-step testing guide
- Complete cURL command examples
- Expected responses
- Test scenarios

---

## 🚀 Deployment

### Recommended Platforms
- **Backend**: Railway, Render, Fly.io
- **Database**: PlanetScale (MySQL), Railway MySQL

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=<production-host>
DB_USER=<production-user>
DB_PASSWORD=<production-password>
DB_NAME=amazon_clone
PORT=5000
FRONTEND_URL=<your-frontend-url>
```

---

## 👨‍💻 Developer

**Pranav**  
SDE Intern Assignment - Amazon Clone Backend

---

## 📝 License

ISC
