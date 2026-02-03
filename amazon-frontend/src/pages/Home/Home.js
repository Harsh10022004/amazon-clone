import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { productAPI, cartAPI } from '../../config/api';
import { fixImageUrl } from '../../utils/imageUtils';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Official Amazon-style Hero Banners (High Quality)
  const carouselImages = [
    {
      url: 'https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Hero/Fuji_TallHero_Beauty_v2_en_US_1x._CB429089975_.jpg',
      alt: "Valentine's Day deals you'll love"
    },
    {
      url: 'https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Hero/Fuji_TallHero_Toys_en_US_1x._CB431858161_.jpg',
      alt: 'Toys for little ones'
    },
    {
      url: 'https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Hero/Fuji_TallHero_Computers_1x._CB432469755_.jpg',
      alt: 'Shop Computers'
    },
    {
      url: 'https://images-na.ssl-images-amazon.com/images/G/01/AmazonExports/Fuji/2020/May/Hero/Fuji_TallHero_Home_v2_en_US_1x._CB429090084_.jpg',
      alt: 'Home Essentials'
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProducts({ limit: 200 });
      if (response.data.success) {
        setProducts(response.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setLoading(false);
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/search?category=${category}`);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://m.media-amazon.com/images/I/71p-tHQ0u1L._AC_SX679_.jpg';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const getCategoryProducts = (catId, catName) => {
    return products.filter(p => p.category === catId || p.category_id === catId || p.category_name === catName).slice(0, 4);
  };

  // --- Product Filtering Logic (Keyword Based for Robustness) ---
  const getProductsByKeyword = (keywords, limit = 4) => {
    // Helper to match any keyword in title or specs
    const matches = products.filter(p => {
      const text = `${p.title} ${p.specifications ? JSON.stringify(p.specifications) : ''}`.toLowerCase();
      return keywords.some(k => text.includes(k.toLowerCase()));
    });
    // Shuffle slightly for variety
    return matches.sort(() => 0.5 - Math.random()).slice(0, limit);
  };

  const electronics = getProductsByKeyword(['laptop', 'phone', 'monitor', 'tab', 'watch'], 4);
  const home = getProductsByKeyword(['home', 'kitchen', 'decor', 'bag', 'bottle'], 4);
  const gaming = getProductsByKeyword(['game', 'mouse', 'keyboard', 'headphone', 'console'], 1);
  const macbooks = getProductsByKeyword(['apple', 'macbook', 'mac', 'ipad'], 2);
  const asusLaptops = getProductsByKeyword(['asus', 'tuf', 'vivobook'], 2);
  const fashion = getProductsByKeyword(['shirt', 'shoe', 'bag', 'watch', 'wear'], 4);
  const audio = getProductsByKeyword(['boat', 'sony', 'jbl', 'noise', 'headphone', 'speaker'], 4);
  const singleFeature = getProductsByKeyword(['samsung', 'oneplus', 'redmi'], 1);

  const allProducts = products.slice(0, 20);

  // --- Widget Components ---

  // 1. Quad Grid Widget (Standard 4 items)
  const QuadWidget = ({ title, items, category, linkText }) => (
    <div className="product-card">
      <h2 className="card-title">{title}</h2>
      <div className="card-grid-2x2">
        {items.map((product) => (
          <div className="grid-item" key={product.id} onClick={() => handleProductClick(product.id)}>
            <img src={fixImageUrl(product.primary_image)} alt={product.title} onError={handleImageError} />
            <span>{product.title.split(' ').slice(0, 3).join(' ')}</span>
          </div>
        ))}
        {/* Fillers if empty */}
        {items.length < 4 && [...Array(4 - items.length)].map((_, i) => (
          <div className="grid-item" key={`empty-${i}`}><span>Coming Soon</span></div>
        ))}
      </div>
      <span className="card-link" onClick={() => handleCategoryClick(category)}>{linkText}</span>
    </div>
  );

  // 2. Single Big Image Widget (Occupies full card content)
  const SingleWidget = ({ title, item, category, linkText }) => (
    <div className="product-card single-widget">
      <h2 className="card-title">{title}</h2>
      <div className="single-product-box" onClick={() => item && handleProductClick(item.id)}>
        {item ? (
          <img src={fixImageUrl(item.primary_image)} alt={item.title} onError={handleImageError} />
        ) : (
          <div className="placeholder-box">Explore {category}</div>
        )}
      </div>
      <span className="card-link" onClick={() => handleCategoryClick(category)}>{linkText}</span>
    </div>
  );

  // 3. Double Grid Widget (Two items side by side or stacked) - NEW
  const DoubleWidget = ({ title, items, category, linkText }) => (
    <div className="product-card">
      <h2 className="card-title">{title}</h2>
      <div className="card-grid-1x2">
        {items.map((product) => (
          <div className="grid-item double-item" key={product.id} onClick={() => handleProductClick(product.id)}>
            <img src={fixImageUrl(product.primary_image)} alt={product.title} onError={handleImageError} />
            <span>{product.title.split(' ').slice(0, 3).join(' ')}</span>
          </div>
        ))}
        {items.length === 0 && <div className="placeholder-box">Trending now</div>}
      </div>
      <span className="card-link" onClick={() => handleCategoryClick(category)}>{linkText}</span>
    </div>
  );

  return (
    <div className="home-container">
      {/* Hero Carousel */}
      <div className="hero-section">
        <div className="hero-carousel">
          <div className="carousel-inner">
            {carouselImages.map((image, index) => (
              <div
                key={index}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image.url})` }}
              >
              </div>
            ))}
          </div>
          <button className="carousel-btn prev" onClick={handlePrevSlide}>
            <FaChevronLeft size={32} />
          </button>
          <button className="carousel-btn next" onClick={handleNextSlide}>
            <FaChevronRight size={32} />
          </button>
          <div className="carousel-fade"></div>
        </div>
      </div>

      {/* Product Cards Grid - DIVERSIFIED LAYOUT */}
      <div className="cards-container">

        {/* Row 1: Quad (Electronics), Quad (Fashion), Single (Gaming), Single (Feature) */}
        <div className="cards-row">
          <QuadWidget
            title="Pick up where you left off"
            items={electronics}
            category="Electronics"
            linkText="See more"
          />
          <QuadWidget
            title="Shop deals in Fashion"
            items={fashion}
            category="Fashion"
            linkText="See all deals"
          />
          <SingleWidget
            title="Get your game on"
            item={gaming[0] || products[0]}
            category="Gaming"
            linkText="Shop gaming"
          />
          <SingleWidget
            title="Up to 60% off | Mobiles"
            item={singleFeature[0] || products[1]}
            category="Mobiles"
            linkText="See all offers"
          />
        </div>

        {/* Row 2: Double (Macs), Double (Asus), Quad (Audio), Quad (Home) - NON-MONOTONIC */}
        <div className="cards-row">
          <DoubleWidget
            title="Apple Store"
            items={macbooks}
            category="Laptops"
            linkText="Shop MacBooks"
          />
          <DoubleWidget
            title="Asus Laptops"
            items={asusLaptops}
            category="Laptops"
            linkText="Visit Store"
          />
          <QuadWidget
            title="Headphones & Audio"
            items={audio}
            category="Audio"
            linkText="Listen now"
          />
          <QuadWidget
            title="Home Essentials"
            items={home}
            category="Home"
            linkText="See more"
          />
        </div>

        {/* Today's Deals Section */}
        <div className="deals-section">
          <div className="deals-header">
            <h2 className="deals-title">Today's Deals</h2>
            <span className="deals-link" onClick={() => navigate('/search')}>See all deals</span>
          </div>
          <div className="deals-scroll">
            {allProducts.map((product) => (
              <div
                key={product.id}
                className="deal-card"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="deal-badge">Up to {Math.floor(Math.random() * 30 + 20)}% off</div>
                <img src={fixImageUrl(product.primary_image)} alt={product.title} className="deal-image" onError={handleImageError} />
                <div className="deal-limited">Limited time deal</div>
                <div className="deal-price">${Number(product.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Keep Shopping - Simple Scroll */}
        <div className="keep-shopping-section">
          <h2 className="section-title">Keep shopping for</h2>
          <div className="products-scroll">
            {products.slice(0, 15).sort(() => Math.random() - 0.5).map((product) => (
              <div
                key={product.id}
                className="product-scroll-item"
                onClick={() => handleProductClick(product.id)}
              >
                <img src={fixImageUrl(product.primary_image)} alt={product.title} onError={handleImageError} />
                <div className="scroll-item-title">{product.title.substring(0, 30)}...</div>
                <div className="scroll-item-price">${Number(product.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
