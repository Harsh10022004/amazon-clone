import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../config/api';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('orders');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders();
      if (response.data.success) {
        setOrders(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FF9900',
      confirmed: '#007185',
      shipped: '#0F7EB4',
      delivered: '#007600',
      cancelled: '#C40000'
    };
    return colors[status] || '#0F1111';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>Your Orders</h1>
      </div>

      <div className="orders-tabs">
        <button 
          className={`tab ${selectedTab === 'orders' ? 'active' : ''}`}
          onClick={() => setSelectedTab('orders')}
        >
          Orders
        </button>
        <button 
          className={`tab ${selectedTab === 'buy-again' ? 'active' : ''}`}
          onClick={() => setSelectedTab('buy-again')}
        >
          Buy Again
        </button>
        <button 
          className={`tab ${selectedTab === 'not-shipped' ? 'active' : ''}`}
          onClick={() => setSelectedTab('not-shipped')}
        >
          Not Yet Shipped
        </button>
      </div>

      <div className="orders-filters">
        <div className="filter-section">
          <span className="filter-label">0 orders placed in</span>
          <select className="filter-select">
            <option>past 3 months</option>
            <option>past 6 months</option>
            <option>2025</option>
            <option>2024</option>
          </select>
        </div>
        <div className="search-orders">
          <input 
            type="text" 
            placeholder="Search all orders" 
            className="amazon-input"
          />
          <button className="amazon-button">Search Orders</button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h2>Looks like you haven't placed an order yet</h2>
          <p>View orders from past 3 months. <a href="#">View orders in 2026</a></p>
          <button 
            className="amazon-button"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-info-group">
                  <div className="order-info-item">
                    <span className="info-label">ORDER PLACED</span>
                    <span className="info-value">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="order-info-item">
                    <span className="info-label">TOTAL</span>
                    <span className="info-value">₹{order.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="order-info-item">
                    <span className="info-label">SHIP TO</span>
                    <span className="info-value">
                      {order.shipping_address.substring(0, 30)}...
                    </span>
                  </div>
                </div>
                <div className="order-id">
                  <span className="info-label">ORDER # {order.id}</span>
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                  <strong>Status:</strong> {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img 
                        src={item.primary_image} 
                        alt={item.title}
                        className="order-item-image"
                        onClick={() => navigate(`/product/${item.product_id}`)}
                      />
                      <div className="order-item-details">
                        <h3 
                          className="order-item-title"
                          onClick={() => navigate(`/product/${item.product_id}`)}
                        >
                          {item.title}
                        </h3>
                        <div className="order-item-quantity">
                          Quantity: {item.quantity}
                        </div>
                        <div className="order-item-price">
                          ₹{item.price_at_purchase.toLocaleString('en-IN')} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-actions">
                  <button className="amazon-button">Track package</button>
                  <button className="amazon-button-secondary amazon-button">Return or replace items</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
