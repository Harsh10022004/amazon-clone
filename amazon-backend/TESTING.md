# Testing Guide - Amazon Clone Backend

This guide provides **spoon-fed testing commands** to verify all API endpoints.

---

## Prerequisites

1. **Server Running**: `npm run dev`
2. **Database Seeded**: `npm run seed`
3. **Base URL**: `http://localhost:5000`

---

## 📋 Quick Test Checklist

- [ ] Health Check
- [ ] Get Products
- [ ] Search Products
- [ ] Get Product Details
- [ ] Add to Cart
- [ ] View Cart
- [ ] Update Cart
- [ ] Remove from Cart
- [ ] Place Order
- [ ] View Order History
- [ ] Add to Wishlist

---

## 🧪 Test Commands

### 1️⃣ Health Check

**Verify server is running**

```bash
curl http://localhost:5000/
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Amazon Clone API is running",
  "version": "1.0.0"
}
```

---

### 2️⃣ Get All Products

```bash
curl http://localhost:5000/api/products
```

**Expected**: List of 12 products with images

---

### 3️⃣ Search Products

**Search for "iPhone":**
```bash
curl "http://localhost:5000/api/products?search=iPhone"
```

**Search by Category:**
```bash
curl "http://localhost:5000/api/products?category=Electronics"
```

**Combined Search:**
```bash
curl "http://localhost:5000/api/products?search=Apple&category=Electronics"
```

---

### 4️⃣ Get Product Details (With Carousel Images)

```bash
curl http://localhost:5000/api/products/1
```

**Expected Response Structure:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Apple iPhone 15 Pro Max",
    "price": 1199.99,
    "specifications": {
      "Storage": "256GB",
      "Color": "Natural Titanium"
    },
    "images": [
      { "image_url": "...", "is_primary": true },
      { "image_url": "...", "is_primary": false }
    ]
  }
}
```

---

### 5️⃣ Get All Categories

```bash
curl http://localhost:5000/api/categories
```

**Expected**: Electronics, Books, Fashion

---

### 6️⃣ Add Item to Cart

```bash
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 2
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "cart_item_id": 1
  }
}
```

---

### 7️⃣ View Cart

```bash
curl http://localhost:5000/api/cart
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "cart_item_id": 1,
        "product_id": 1,
        "title": "Apple iPhone 15 Pro Max",
        "price": 1199.99,
        "quantity": 2,
        "image": "..."
      }
    ],
    "summary": {
      "item_count": 2,
      "subtotal": 2399.98,
      "total": 2399.98
    }
  }
}
```

---

### 8️⃣ Update Cart Item Quantity

```bash
curl -X PUT http://localhost:5000/api/cart/1 \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

---

### 9️⃣ Remove Item from Cart

```bash
curl -X DELETE http://localhost:5000/api/cart/1
```

---

### 🔟 Add Multiple Items to Cart (For Order Testing)

```bash
# Add iPhone
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 1}'

# Add Headphones
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"product_id": 2, "quantity": 1}'

# Add Book
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"product_id": 5, "quantity": 2}'
```

---

### 1️⃣1️⃣ Place Order

**⚠️ Make sure cart has items first (see step 10)**

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "shipping_address": "123 Main Street, Apartment 4B, New York, NY 10001, USA"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order_id": 1,
    "total_amount": 1633.97,
    "status": "confirmed"
  }
}
```

**📧 Check Console**: You should see mock email notification

---

### 1️⃣2️⃣ Get Order History (Bonus Feature)

```bash
curl http://localhost:5000/api/orders
```

**Expected**: List of all user's orders

---

### 1️⃣3️⃣ Get Order Details

```bash
curl http://localhost:5000/api/orders/1
```

---

### 1️⃣4️⃣ Add to Wishlist (Bonus Feature)

```bash
curl -X POST http://localhost:5000/api/wishlist \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 3
  }'
```

---

### 1️⃣5️⃣ View Wishlist

```bash
curl http://localhost:5000/api/wishlist
```

---

### 1️⃣6️⃣ Remove from Wishlist

```bash
curl -X DELETE http://localhost:5000/api/wishlist/3
```

---

## 🧩 Complete Test Scenario

**Full User Journey Test:**

```bash
# 1. Browse products
curl "http://localhost:5000/api/products?category=Electronics"

# 2. View product details
curl http://localhost:5000/api/products/1

# 3. Add to cart
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 1}'

# 4. Add another item
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"product_id": 2, "quantity": 1}'

# 5. View cart
curl http://localhost:5000/api/cart

# 6. Place order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"shipping_address": "123 Main St, New York, NY 10001"}'

# 7. View order history
curl http://localhost:5000/api/orders
```

---

## ❌ Error Testing

### Invalid Product ID
```bash
curl http://localhost:5000/api/products/999
```
**Expected**: 404 Not Found

### Empty Shipping Address
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"shipping_address": ""}'
```
**Expected**: 400 Bad Request

### Place Order with Empty Cart
```bash
# First clear cart
curl -X DELETE http://localhost:5000/api/cart

# Try to place order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"shipping_address": "123 Main St"}'
```
**Expected**: 400 "Cart is empty"

---

## 📊 Response Format

All API responses follow this structure:

**Success:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 🔧 Troubleshooting

**Problem**: `ECONNREFUSED`  
**Solution**: Ensure server is running (`npm run dev`)

**Problem**: `Product not found`  
**Solution**: Run database seeder (`npm run seed`)

**Problem**: `Database connection failed`  
**Solution**: Check MySQL is running and `.env` credentials are correct

---

## ✅ Testing Checklist

After running all commands, verify:

- [ ] Products are retrieved correctly
- [ ] Search and filter work
- [ ] Product details include multiple images
- [ ] Cart operations work (add, update, remove)
- [ ] Order placement succeeds
- [ ] Order history is maintained
- [ ] Wishlist functions properly
- [ ] Error handling works correctly

---

**Happy Testing! 🚀**
