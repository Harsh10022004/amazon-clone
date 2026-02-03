#!/bin/bash

# This script generates ALL remaining frontend files for the Amazon clone

# Search Results CSS
cat > src/pages/Search/SearchResults.css << 'EOF'
.search-results-container {
  display: flex;
  gap: 20px;
  max-width: 1500px;
  margin: 20px auto;
  padding: 0 20px;
}

.search-sidebar {
  width: 250px;
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 3px;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 700;
  color: #0F1111;
  margin-bottom: 10px;
}

.sidebar-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-item {
  color: #007185;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 0;
}

.sidebar-item:hover {
  color: #C7511F;
  text-decoration: underline;
}

.sidebar-divider {
  height: 1px;
  background-color: #D5D9D9;
  margin: 15px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #0F1111;
  cursor: pointer;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-input {
  width: 80px;
  padding: 5px;
  border: 1px solid #888C8C;
  border-radius: 3px;
  font-size: 14px;
}

.search-main {
  flex: 1;
}

.results-header {
  background-color: #FFFFFF;
  padding: 15px 20px;
  border-radius: 3px;
  margin-bottom: 10px;
}

.results-title {
  font-size: 20px;
  font-weight: 700;
  color: #0F1111;
  margin-bottom: 5px;
}

.results-subtitle {
  font-size: 14px;
  color: #565959;
}

.sort-bar {
  background-color: #FFFFFF;
  padding: 10px 20px;
  border-radius: 3px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.sort-select {
  padding: 5px 10px;
  border: 1px solid #888C8C;
  border-radius: 3px;
  font-size: 14px;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-item {
  background-color: #FFFFFF;
  padding: 20px;
  border-radius: 3px;
  display: flex;
  gap: 20px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.product-item:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.product-image-wrapper {
  width: 260px;
  height: 285px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F7F8F8;
  border-radius: 3px;
  padding: 10px;
}

.product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-details {
  flex: 1;
}

.product-badge {
  font-size: 12px;
  color: #565959;
  margin-bottom: 5px;
}

.product-title {
  font-size: 16px;
  color: #0F1111;
  font-weight: 400;
  margin-bottom: 10px;
  line-height: 1.3;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.product-stars {
  display: flex;
  gap: 2px;
}

.rating-count {
  color: #007185;
  font-size: 14px;
}

.product-bought {
  font-size: 14px;
  color: #565959;
  margin-bottom: 10px;
}

.product-price-container {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
}

.product-delivery {
  font-size: 14px;
  color: #007600;
  margin-bottom: 15px;
}

.add-to-cart-btn {
  padding: 8px 20px !important;
}

.no-results {
  background-color: #FFFFFF;
  padding: 60px 20px;
  text-align: center;
  border-radius: 3px;
}

@media (max-width: 900px) {
  .search-sidebar {
    display: none;
  }
  
  .product-item {
    flex-direction: column;
  }
  
  .product-image-wrapper {
    width: 100%;
    height: 300px;
  }
}
EOF

echo "SearchResults.css created"

# Product Detail Page files
cat > src/pages/ProductDetail/ProductDetail.js << 'EOF'
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaCheck } from 'react-icons/fa';
import { productAPI, cartAPI } from '../../config/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      if (response.data.success) {
        setProduct(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await cartAPI.addToCart(product.id, quantity);
      if (response.data.success) {
        alert('Added to cart successfully!');
        if (window.updateCartCount) {
          window.updateCartCount();
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <button className="amazon-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-content">
        {/* Left - Image Gallery */}
        <div className="image-section">
          <div className="image-thumbnails">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.title} ${index + 1}`}
                className={`thumbnail ${currentImage === index ? 'active' : ''}`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
          <div className="main-image-container">
            <img
              src={product.images[currentImage]}
              alt={product.title}
              className="main-image"
            />
          </div>
        </div>

        {/* Middle - Product Info */}
        <div className="info-section">
          <h1 className="product-detail-title">{product.title}</h1>
          
          <div className="product-meta">
            <a href="#reviews" className="meta-link">
              Visit the {product.specifications?.Brand || 'Brand'} Store
            </a>
          </div>

          <div className="rating-section">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  color={i < Math.floor(product.rating) ? '#FFA41C' : '#C6C6C6'}
                  size={18}
                />
              ))}
            </div>
            <span className="rating-text">{product.rating}</span>
            <a href="#reviews" className="rating-count-link">
              {product.review_count} ratings
            </a>
          </div>

          <div className="section-divider"></div>

          <div className="price-section-detail">
            <span className="price-label">M.R.P.:</span>
            <span className="price-original">₹{(product.price * 1.2).toLocaleString('en-IN')}</span>
            <div className="price-current">
              <span className="price-symbol">₹</span>
              <span className="price-value">{product.price.toLocaleString('en-IN')}</span>
            </div>
            <div className="price-savings">
              Save extra with No Cost EMI
            </div>
          </div>

          <div className="section-divider"></div>

          <div className="offers-section">
            <h3>Offers</h3>
            <div className="offer-items">
              <div className="offer-item">
                <strong>Bank Offer</strong> Upto ₹{Math.floor(product.price * 0.1).toLocaleString('en-IN')} Discount on select Credit Cards
              </div>
              <div className="offer-item">
                <strong>Cashback</strong> Upto {Math.floor(Math.random() * 10 + 5)}% cashback on Amazon Pay ICICI Bank Credit Card
              </div>
              <div className="offer-item">
                <strong>Partner Offers</strong> Get GST invoice and save up to 18% on business purchases
              </div>
            </div>
          </div>

          <div className="section-divider"></div>

          {product.specifications && (
            <div className="specs-section">
              <h3>About this item</h3>
              <ul className="specs-list">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right - Buy Box */}
        <div className="buy-box">
          <div className="buy-box-price">
            <span className="price-symbol">₹</span>
            <span className="price-value">{product.price.toLocaleString('en-IN')}</span>
          </div>

          <div className="delivery-info-box">
            <div className="delivery-label">FREE delivery</div>
            <div className="delivery-date">
              <strong>Wednesday, 4 February</strong>
            </div>
            <div className="delivery-details">Details</div>
          </div>

          <div className="delivery-info-box">
            <div className="delivery-label">Or fastest delivery</div>
            <div className="delivery-date">
              <strong>Tomorrow, 3 February</strong>. Order within 7 hrs 39 mins.
            </div>
            <div className="delivery-details">Details</div>
          </div>

          <div className="stock-info">
            <FaCheck color="#067D62" /> In Stock
          </div>

          <div className="quantity-selector-detail">
            <label>Quantity:</label>
            <select 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="amazon-select"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>

          <button className="amazon-button" onClick={handleAddToCart} style={{ width: '100%', marginBottom: '10px' }}>
            Add to Cart
          </button>

          <button className="amazon-button-secondary amazon-button" onClick={handleBuyNow} style={{ width: '100%' }}>
            Buy Now
          </button>

          <div className="section-divider"></div>

          <div className="ship-from">
            <div><strong>Ships from</strong> Amazon</div>
            <div><strong>Sold by</strong> {product.specifications?.Brand || 'Amazon'}</div>
          </div>

          <div className="protection-plan">
            <h4>Add a Protection Plan:</h4>
            <label className="checkbox-label">
              <input type="checkbox" className="amazon-checkbox" />
              <span>1 Year Protection for ₹{Math.floor(product.price * 0.05).toLocaleString('en-IN')}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
EOF

echo "ProductDetail.js created"

# Continue with more files...
echo "Generating remaining files..."

