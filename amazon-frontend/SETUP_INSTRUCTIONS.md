# Amazon Clone - Complete Setup Instructions

## Project Overview

This is a pixel-perfect Amazon clone with full-stack functionality:
- **Frontend**: React.js with exact Amazon UI/UX
- **Backend**: Node.js + Express (already created from setup_project.js)
- **Database**: MySQL

---

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
3. **npm** (comes with Node.js)

Verify installations:
```bash
node --version
npm --version
mysql --version
```

---

## Part 1: Backend Setup

### Step 1: Generate Backend (if not already done)

If you haven't run the setup_project.js script yet:

```bash
node setup_project__1_.js
```

This creates the `amazon-backend` folder with complete backend code.

### Step 2: Navigate to Backend Directory

```bash
cd amazon-backend
```

### Step 3: Install Backend Dependencies

```bash
npm install
```

This installs:
- express (web framework)
- mysql2 (database driver)
- cors (cross-origin resource sharing)
- dotenv (environment variables)
- nodemon (development server)

### Step 4: Configure Database

1. **Edit the .env file**:
```bash
nano .env
```

2. **Update with your MySQL credentials**:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_mysql_password_here
DB_NAME=amazon_clone
DB_PORT=3306

PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:3000
```

**Important**: Replace `your_actual_mysql_password_here` with your actual MySQL root password!

3. **Save and exit** (Ctrl+X, then Y, then Enter in nano)

### Step 5: Seed the Database

This creates tables and populates with sample data:

```bash
npm run seed
```

You should see:
```
✓ Connected to MySQL server
✓ Database 'amazon_clone' ready
✓ Tables created successfully
✓ Inserted 1 user
✓ Inserted 3 categories
✓ Inserted 12 products
```

### Step 6: Start Backend Server

```bash
npm run dev
```

You should see:
```
Server running on port 5000
Database connected successfully
```

**Keep this terminal window open!** The backend server must keep running.

### Step 7: Test Backend (Optional)

Open a new terminal and test:

```bash
curl http://localhost:5000/api/products
```

You should see JSON response with products.

---

## Part 2: Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **NEW terminal window** (keep backend running in the first one):

```bash
cd amazon-frontend
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

This installs all React dependencies including:
- react and react-dom
- react-router-dom (routing)
- axios (HTTP client)
- react-icons (icons)

**Note**: This may take 2-3 minutes depending on your internet speed.

### Step 3: Create Environment File

```bash
cp .env.example .env
```

The default configuration points to `http://localhost:5000/api` which should work if your backend is running on port 5000.

If your backend is on a different port, edit `.env`:
```env
REACT_APP_API_URL=http://localhost:YOUR_PORT/api
```

### Step 4: Start Frontend Development Server

```bash
npm start
```

This will:
1. Start the React development server
2. Automatically open your browser to `http://localhost:3000`
3. Enable hot-reload (changes auto-refresh)

You should see:
```
Compiled successfully!

You can now view amazon-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

---

## Part 3: Using the Application

Your Amazon clone is now running! You should see:

### Home Page (`http://localhost:3000`)
- Hero carousel with promotional banners
- Product cards grouped by category
- "Today's Deals" section
- Responsive Amazon-style layout

### Navigation Features

1. **Search Products**
   - Click the search bar at top
   - Type "iPhone" or any product name
   - Press Enter or click search icon
   - See filtered results

2. **View Product Details**
   - Click any product image or title
   - See full product page with:
     - Image gallery
     - Pricing and offers
     - Add to Cart button
     - Buy Now button

3. **Shopping Cart**
   - Click "Cart" in top-right
   - Add/remove items
   - Update quantities
   - Proceed to checkout

4. **Orders**
   - Click "Returns & Orders" in header
   - View order history
   - Track orders

### Test User Flow

1. **Browse Products**: Go to home page
2. **Search**: Search for "iPhone"  
3. **View Details**: Click on a product
4. **Add to Cart**: Click "Add to Cart" button
5. **View Cart**: Click cart icon (shows item count)
6. **Place Order**: Click "Proceed to Buy"
7. **View Orders**: Click "Returns & Orders"

---

## Part 4: Troubleshooting

### Issue: "Cannot connect to database"

**Solution**:
1. Verify MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # Mac/Linux
   sudo systemctl start mysql
   ```

2. Check `.env` credentials in backend folder
3. Test MySQL connection:
   ```bash
   mysql -u root -p
   ```

### Issue: "Port 3000 is already in use"

**Solution**:
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Issue: "Port 5000 is already in use"

**Solution**: Change backend port in `amazon-backend/.env`:
```env
PORT=5001
```

Then update frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### Issue: "Cannot GET /api/products"

**Solution**:
1. Ensure backend is running (`npm run dev` in amazon-backend folder)
2. Check backend terminal for errors
3. Verify database is seeded (`npm run seed`)

### Issue: "CORS error in browser console"

**Solution**: Backend already has CORS enabled. If issue persists:
1. Restart both frontend and backend servers
2. Clear browser cache
3. Check `FRONTEND_URL` in backend `.env` matches frontend URL

### Issue: "Module not found" errors

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Part 5: Development Tips

### Hot Reload

Both servers support hot reload:
- **Frontend**: Save any file → Browser auto-refreshes
- **Backend**: Save any file → Server auto-restarts (nodemon)

### Viewing Logs

- **Frontend logs**: Check browser console (F12)
- **Backend logs**: Check terminal where `npm run dev` is running

### Database Changes

If you modify database schema:
```bash
cd amazon-backend
npm run seed
```

This drops and recreates all tables.

### API Testing

Use curl or Postman to test backend:

```bash
# Get all products
curl http://localhost:5000/api/products

# Get product by ID
curl http://localhost:5000/api/products/1

# Search products
curl "http://localhost:5000/api/products?search=iphone"

# Get cart
curl http://localhost:5000/api/cart

# Add to cart
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 1}'
```

---

## Part 6: Production Build

### Build Frontend for Production

```bash
cd amazon-frontend
npm run build
```

This creates an optimized production build in the `build` folder.

### Deploy Options

1. **Frontend**: Deploy `build` folder to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

2. **Backend**: Deploy to:
   - AWS EC2
   - Heroku
   - Digital Ocean
   - Railway

3. **Database**: Use:
   - AWS RDS
   - Google Cloud SQL
   - PlanetScale
   - Your hosting provider's MySQL

---

## Part 7: Project Structure

```
amazon-clone/
│
├── amazon-backend/              # Backend API
│   ├── src/
│   │   ├── config/             # Database connection
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic
│   │   ├── routes/             # API routes
│   │   ├── middleware/         # Error handling
│   │   └── server.js           # Entry point
│   ├── database/
│   │   ├── schema.sql          # Database schema
│   │   └── seed.js             # Data seeding
│   ├── .env                    # Environment variables
│   └── package.json
│
└── amazon-frontend/            # React Frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Header/         # Navigation header
    │   ├── pages/
    │   │   ├── Home/           # Home page
    │   │   ├── Search/         # Search results
    │   │   ├── ProductDetail/  # Product details
    │   │   ├── Cart/           # Shopping cart
    │   │   └── Orders/         # Order history
    │   ├── config/
    │   │   └── api.js          # API configuration
    │   ├── App.js              # Main app component
    │   ├── App.css             # Global styles
    │   └── index.js            # Entry point
    ├── .env                    # Environment variables
    └── package.json
```

---

## Part 8: Features Implemented

### ✅ Core Features

- **Product Listing**: Browse all products with filtering
- **Search**: Full-text search with category filters
- **Product Details**: Complete product pages with images
- **Shopping Cart**: Add, update, remove items
- **Order Placement**: Complete checkout flow
- **Order History**: View past orders

### ✅ UI/UX Features

- **Pixel-perfect Amazon design**: Exact colors, fonts, spacing
- **Responsive**: Works on mobile, tablet, desktop
- **Carousel**: Auto-rotating hero banner
- **Product Cards**: Grid layout like Amazon
- **Star Ratings**: Dynamic rating display
- **Price Formatting**: Indian Rupee with proper formatting
- **Delivery Info**: Estimated delivery dates
- **Stock Status**: In-stock indicators

### ✅ Technical Features

- **3-Layer Architecture**: Controllers, Services, Routes
- **RESTful API**: Standard HTTP methods
- **Error Handling**: Comprehensive error management
- **Database Transactions**: For order placement
- **CORS Enabled**: Frontend-backend communication
- **Environment Variables**: Secure configuration

---

## Part 9: Dependencies

### Backend Dependencies

```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.5",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "nodemon": "^3.0.2"
}
```

### Frontend Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2",
  "react-icons": "^4.12.0"
}
```

---

## Part 10: Support

If you encounter any issues:

1. **Check both terminals** for error messages
2. **Verify MySQL is running** and credentials are correct
3. **Ensure both servers are running** (backend on 5000, frontend on 3000)
4. **Clear browser cache** and restart servers
5. **Check firewall settings** if can't connect

---

## Quick Start Summary

```bash
# Terminal 1 - Backend
cd amazon-backend
npm install
# Edit .env with your MySQL password
npm run seed
npm run dev

# Terminal 2 - Frontend (NEW terminal)
cd amazon-frontend
npm install
npm start

# Browser opens automatically to http://localhost:3000
```

---

**🎉 Congratulations! Your Amazon clone is now running!**

Browse to `http://localhost:3000` and start shopping!
