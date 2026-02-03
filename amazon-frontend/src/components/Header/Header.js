import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaSearch, FaBars, FaCaretDown } from 'react-icons/fa';
import { cartAPI } from '../../config/api';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch cart count on component mount
  useEffect(() => {
    fetchCartCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await cartAPI.getCart();
      if (response.data.success) {
        const totalItems = response.data.data.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setCartItemCount(totalItems);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${category}`);
    } else {
      navigate(`/search?category=${category}`);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleOrdersClick = () => {
    navigate('/orders');
  };

  window.updateCartCount = fetchCartCount;

  return (
    <header className="amazon-header">
      {/* Top Navigation Bar */}
      <div className="header-top">
        {/* Amazon Logo */}
        <div className="header-logo" onClick={handleLogoClick}>
          <span className="logo-text">amazon</span>
          <span className="logo-in">.in</span>
        </div>

        {/* Deliver To */}
        <div className="header-deliver">
          <FaMapMarkerAlt className="deliver-icon" />
          <div className="deliver-text">
            <span className="deliver-label">Delivering to India</span>
            <span className="deliver-location">Update location</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="header-search">
          <form className="search-container" onSubmit={handleSearch}>
            <select
              className="search-dropdown"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home & Kitchen</option>
              <option value="Toys">Toys & Games</option>
              <option value="Beauty">Beauty</option>
              <option value="Sports">Sports</option>
            </select>
            <input
              type="text"
              className="search-input"
              placeholder="Search Amazon.in"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">
              <FaSearch className="search-icon" />
            </button>
          </form>
        </div>

        {/* Language Selector */}
        <div className="header-language">
          <div className="flag-icon"></div>
          <span className="language-text">EN</span>
          <FaCaretDown size={10} />
        </div>

        {/* Account & Lists */}
        <div className="header-account">
          <span className="account-label">Hello, Harsh</span>
          <span className="account-name">
            Account & Lists
            <FaCaretDown size={10} />
          </span>

          {/* Account Dropdown - Hover Menu */}
          <div className="account-dropdown">
            <div className="dropdown-arrow"></div>
            <div className="dropdown-profile-header">
              <div className="profile-row">
                <div className="profile-avatar">
                  <svg viewBox="0 0 24 24" fill="#D5D9D9"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
                </div>
                <div className="profile-info">
                  <span className="profile-name">Harsh Singhania</span>
                  <span className="profile-email">kraj28822@gmail.com</span>
                </div>
                <div className="profile-actions">
                  <span className="action-link">Switch Accounts</span>
                  <span className="action-signout">Sign Out</span>
                </div>
              </div>
            </div>

            <div className="dropdown-columns">
              <div className="dropdown-col">
                <h3 className="col-header">Your Lists</h3>
                <ul className="col-links">
                  <li>Create a List</li>
                  <li>Find a List or Registry</li>
                  <li>Your Saved Books</li>
                </ul>
              </div>
              <div className="dropdown-col border-left">
                <h3 className="col-header">Your Account</h3>
                <ul className="col-links">
                  <li>Account</li>
                  <li>Orders</li>
                  <li>Recommendations</li>
                  <li>Browsing History</li>
                  <li>Your Shopping preferences</li>
                  <li>Watchlist</li>
                  <li>Video Purchases & Rentals</li>
                  <li>Kindle Unlimited</li>
                  <li>Content & Devices</li>
                  <li>Subscribe & Save Items</li>
                  <li>Memberships & Subscriptions</li>
                  <li>Music Library</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Returns & Orders */}
        <div className="header-orders" onClick={handleOrdersClick}>
          <span className="orders-label">Returns</span>
          <span className="orders-text">& Orders</span>
        </div>

        {/* Shopping Cart - Refined Perspective (Right Smaller) */}
        <div className="header-cart" onClick={handleCartClick}>
          <div className="cart-icon-container">
            <span className="cart-count">{cartItemCount}</span>
            <svg
              className="cart-icon"
              viewBox="0 0 50 50"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 
                 Refined Path for "Right part smaller" & Perspective:
                 M2 9  : Handle Top Left
                 L9 9  : Handle Bend
                 L14 33: Basket Bottom Left
                 L43 33: Basket Bottom Right
                 L46 14: Basket Top Right (LOWER than left side y=9) -> Shorter right part
               */}
              <path
                d="M2 9 L9 9 L14 33 L43 33 L46 14"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle cx="18" cy="42" r="4.5" fill="#FFFFFF" />
              <circle cx="40" cy="42" r="4.5" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="cart-text">Cart</span>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="header-bottom">
        <div className="nav-hamburger">
          <FaBars />
          <span className="nav-all-text">All</span>
        </div>

        <div className="nav-links">
          <div className="nav-link" onClick={() => navigate('/search?category=Fresh')}>Fresh</div>
          <div className="nav-link">MX Player</div>
          <div className="nav-link">Sell</div>
          <div className="nav-link">Gift Cards</div>
          <div className="nav-link">Buy Again</div>
          <div className="nav-link">Browsing History</div>
          <div className="nav-link">Harsh's Amazon.in</div>
          <div className="nav-link">Amazon Pay</div>
          <div className="nav-link">Coupons</div>
          <div className="nav-link">AmazonBasics</div>
          <div className="nav-link" onClick={() => navigate('/search?category=Fashion')}>Fashion</div>
          <div className="nav-link">Gift Ideas</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
