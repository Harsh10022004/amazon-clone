import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { cartAPI, orderAPI } from '../../config/api';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      if (response.data.success) {
        setCartItems(response.data.data.items);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) return;

    try {
      const response = await cartAPI.updateCartItem(productId, newQuantity);
      if (response.data.success) {
        // Update local state immediately for better UX
        setCartItems(prev => prev.map(item =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        ));
        if (window.updateCartCount) {
          window.updateCartCount();
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await cartAPI.removeFromCart(productId);
      if (response.data.success) {
        setCartItems(prev => prev.filter(item => item.product_id !== productId));
        if (window.updateCartCount) {
          window.updateCartCount();
        }
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const handleProceedToCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const shippingAddress = "123 Main Street, New York, NY 10001";

    setCheckoutLoading(true);
    try {
      const response = await orderAPI.placeOrder(shippingAddress);
      if (response.data.success) {
        alert('Order placed successfully!');
        navigate('/orders');
        if (window.updateCartCount) {
          window.updateCartCount();
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-page">
        <div className="empty-cart-container">
          <div className="empty-cart-image">
            <img
              src="https://m.media-amazon.com/images/G/01/cart/empty/kettle-desaturated._CB445243794_.svg"
              alt="Empty cart"
            />
          </div>
          <div className="empty-cart-content">
            <h2>Your Amazon Cart is empty</h2>
            <p className="empty-cart-link">
              <span onClick={() => navigate('/')}>Shop today's deals</span>
            </p>
            <div className="empty-cart-buttons">
              <button
                className="signin-button"
                onClick={() => navigate('/')}
              >
                Sign in to your account
              </button>
              <button
                className="signup-button"
                onClick={() => navigate('/')}
              >
                Sign up now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-main">
          <h1 className="cart-title">Shopping Cart</h1>
          <div className="cart-deselect">
            <span className="deselect-link">Deselect all items</span>
          </div>
          <div className="price-header">Price</div>
          <div className="cart-divider"></div>

          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.product_id} className="cart-item">
                <div className="item-checkbox">
                  <input type="checkbox" className="amazon-checkbox" defaultChecked />
                </div>

                <div className="item-image-container" onClick={() => navigate(`/product/${item.product_id}`)}>
                  <img
                    src={item.primary_image}
                    alt={item.title}
                    className="item-image"
                  />
                </div>

                <div className="item-details">
                  <h3
                    className="item-title"
                    onClick={() => navigate(`/product/${item.product_id}`)}
                  >
                    {item.title}
                  </h3>

                  <div className="item-stock">
                    <FaCheck color="#007600" size={12} />
                    <span>In Stock</span>
                  </div>

                  <div className="item-shipping">
                    <img
                      src="https://m.media-amazon.com/images/G/01/prime/prime-delivery-badge._CB485934220_.png"
                      alt="Prime"
                      className="prime-badge-img"
                    />
                    <span className="free-returns">FREE Returns</span>
                  </div>

                  <div className="item-gift">
                    <input type="checkbox" className="gift-checkbox" />
                    <span>This is a gift</span>
                    <span className="learn-more">Learn more</span>
                  </div>

                  <div className="item-actions">
                    <div className="quantity-dropdown">
                      <span className="qty-label">Qty:</span>
                      <select
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value))}
                        className="qty-select"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                    <span className="action-divider">|</span>
                    <button
                      className="action-link"
                      onClick={() => handleRemoveItem(item.product_id)}
                    >
                      Delete
                    </button>
                    <span className="action-divider">|</span>
                    <button className="action-link">Save for later</button>
                    <span className="action-divider">|</span>
                    <button className="action-link">Compare with similar items</button>
                    <span className="action-divider">|</span>
                    <button className="action-link">Share</button>
                  </div>
                </div>

                <div className="item-price">
                  <span className="price-value">${Number(item.price).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-subtotal-main">
            Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}):
            <strong> ${calculateSubtotal().toFixed(2)}</strong>
          </div>
        </div>

        <div className="cart-sidebar">
          <div className="free-shipping-message">
            <FaCheck color="#007600" size={16} />
            <span>
              Your order qualifies for FREE Shipping. Choose this option at checkout.
              <span className="see-details"> See details</span>
            </span>
          </div>

          <div className="sidebar-subtotal">
            Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}):
            <strong> ${calculateSubtotal().toFixed(2)}</strong>
          </div>

          <label className="gift-order-checkbox">
            <input type="checkbox" className="amazon-checkbox" />
            <span>This order contains a gift</span>
          </label>

          <button
            className="checkout-button"
            onClick={handleProceedToCheckout}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? 'Processing...' : 'Proceed to checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
