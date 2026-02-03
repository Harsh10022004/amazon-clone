import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';
import { productAPI, cartAPI } from '../../config/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      if (response.data.success) {
        const productData = response.data.data;
        // Ensure images is an array
        if (!productData.images || productData.images.length === 0) {
          productData.images = productData.primary_image
            ? [{ image_url: productData.primary_image }]
            : [{ image_url: 'https://via.placeholder.com/500' }];
        }
        setProduct(productData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setLoading(false);
    }
  };

  const getImageUrl = (img) => {
    if (typeof img === 'string') return img;
    return img.image_url || img.url || '';
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const response = await cartAPI.addToCart(product.id, quantity);
      if (response.data.success) {
        if (window.updateCartCount) {
          window.updateCartCount();
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const renderStars = (rating) => {
    const ratingNum = Number(rating) || 4;
    return (
      <div className="rating-stars">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            color={i < Math.floor(ratingNum) ? '#FF9900' : '#C6C6C6'}
            size={16}
          />
        ))}
      </div>
    );
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

  const images = product.images || [];
  const currentImageUrl = images.length > 0 ? getImageUrl(images[currentImage]) : '';

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-content">
          {/* Left - Image Gallery */}
          <div className="image-section">
            <div className="image-thumbnails">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail-wrapper ${currentImage === index ? 'active' : ''}`}
                  onMouseEnter={() => setCurrentImage(index)}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`${product.title} ${index + 1}`}
                    className="thumbnail"
                  />
                </div>
              ))}
            </div>
            <div className="main-image-container">
              <img
                src={currentImageUrl}
                alt={product.title}
                className="main-image"
              />
            </div>
          </div>

          {/* Middle - Product Info */}
          <div className="info-section">
            <h1 className="product-title">{product.title}</h1>

            <div className="brand-link">
              Visit the {product.specifications?.Brand || 'Brand'} Store
            </div>

            <div className="rating-row">
              <span className="rating-value">{Number(product.rating || 4.5).toFixed(1)}</span>
              {renderStars(product.rating || 4.5)}
              <span className="rating-count">
                {product.review_count || Math.floor(Math.random() * 1000 + 100)} ratings
              </span>
            </div>

            <div className="section-divider"></div>

            <div className="price-section">
              <div className="price-row-detail">
                <span className="price-label">Price:</span>
                <span className="price-symbol">$</span>
                <span className="price-value">{Number(product.price).toFixed(2)}</span>
              </div>
              <div className="price-info">
                $12 delivery. <span className="details-link">Details</span>
              </div>
            </div>

            <div className="section-divider"></div>

            {/* Offers Section */}
            <div className="offers-section">
              <div className="offer-row">
                <span className="offer-type">Bank Offer</span>
                <span className="offer-text">5% back with Amazon Visa</span>
              </div>
              <div className="offer-row">
                <span className="offer-type">No Rush</span>
                <span className="offer-text">Save $1 at checkout</span>
              </div>
            </div>

            <div className="section-divider"></div>

            {/* Product Details Table */}
            <div className="product-details-table">
              <div className="detail-row">
                <span className="detail-label">Brand</span>
                <span className="detail-value">{product.specifications?.Brand || 'Generic'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Model Name</span>
                <span className="detail-value">{product.specifications?.Model || product.title.split(' ').slice(0, 2).join(' ')}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Category</span>
                <span className="detail-value">{product.category_name || 'General'}</span>
              </div>
            </div>

            <div className="section-divider"></div>

            {/* About This Item */}
            <div className="about-section">
              <h3>About this item</h3>
              <ul className="about-list">
                <li>{product.description || 'High quality product with excellent features'}</li>
                {product.specifications && Object.entries(product.specifications).slice(0, 4).map(([key, value]) => (
                  <li key={key}><strong>{key}:</strong> {value}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right - Buy Box */}
          <div className="buy-box">
            <div className="buy-box-price">
              <span className="price-symbol">$</span>
              <span className="price-amount">{Number(product.price).toFixed(2)}</span>
            </div>

            <div className="delivery-info">
              <div className="free-delivery-row">
                <span className="free-label">FREE delivery</span>
                <span className="delivery-date"> Wednesday, February 5</span>
              </div>
              <div className="fastest-delivery">
                Or fastest delivery <strong>Tomorrow, February 3</strong>. Order within 8 hrs 30 mins
              </div>
            </div>

            <div className="location-row">
              <FaMapMarkerAlt size={16} color="#007185" />
              <span className="location-link">Deliver to New York 10001</span>
            </div>

            <div className="stock-status">
              <FaCheck color="#007600" size={14} />
              <span className="in-stock">In Stock</span>
            </div>

            <div className="quantity-row">
              <span className="qty-label">Qty:</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="qty-dropdown"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            <button
              className="add-to-cart-btn-detail"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>

            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>

            <div className="secure-transaction">
              <FaCheck color="#007185" size={12} />
              <span>Secure transaction</span>
            </div>

            <div className="seller-info">
              <div className="seller-row">
                <span className="seller-label">Ships from</span>
                <span className="seller-value">Amazon</span>
              </div>
              <div className="seller-row">
                <span className="seller-label">Sold by</span>
                <span className="seller-value link">Amazon.com</span>
              </div>
              <div className="seller-row">
                <span className="seller-label">Returns</span>
                <span className="seller-value link">Eligible for Return, Refund or Replacement</span>
              </div>
            </div>

            <div className="gift-option">
              <input type="checkbox" id="gift-checkbox" />
              <label htmlFor="gift-checkbox">Add a gift receipt for easy returns</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
