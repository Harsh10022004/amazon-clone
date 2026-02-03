import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaStar, FaCheck } from 'react-icons/fa';
import { productAPI, cartAPI } from '../../config/api';

/* Inline Styles to guarantee visibility - bypassing any CSS file issues */
const styles = {
  page: {
    backgroundColor: '#fff',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    width: '100%',
    maxWidth: '1500px',
    padding: '20px',
  },
  sidebar: {
    width: '250px',
    flexShrink: 0,
    borderRight: '1px solid #e7e7e7',
    paddingRight: '20px',
    display: 'block' // Enforce visibility
  },
  main: {
    flex: 1,
    paddingLeft: '20px',
    minWidth: 0,
  },
  resultsInfo: {
    paddingBottom: '10px',
    marginBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  productCard: {
    display: 'flex',
    border: '1px solid #e7e7e7',
    borderRadius: '4px',
    marginBottom: '12px',
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative', // Ensure context
    minHeight: '200px', // Force height
  },
  imageBox: {
    width: '220px',
    minWidth: '220px', // Prevent crushing
    backgroundColor: '#f7f7f7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '180px',
    objectFit: 'contain',
    mixBlendMode: 'multiply',
  },
  info: {
    flex: 1,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '18px',
    fontWeight: 500,
    marginBottom: '4px',
    color: '#0F1111',
    lineHeight: 1.25,
    cursor: 'pointer',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    margin: '8px 0',
  },
  priceMain: {
    fontSize: '28px',
    fontWeight: 500,
  },
  button: {
    marginTop: '10px',
    backgroundColor: '#FFD814',
    border: 'none',
    borderRadius: '20px',
    padding: '8px 20px',
    cursor: 'pointer',
    width: 'fit-content',
    fontSize: '13px',
  }
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';

  useEffect(() => {
    fetchSearchResults();
  }, [query, category, sortBy]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category && category !== 'All') params.category = category;
      if (query) params.search = query;

      const response = await productAPI.getProducts(params);

      if (response.data.success) {
        let sortedProducts = [...response.data.data];
        // Sorting logic retained
        if (sortBy === 'price-low') sortedProducts.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-high') sortedProducts.sort((a, b) => b.price - a.price);
        else if (sortBy === 'rating') sortedProducts.sort((a, b) => b.rating - a.rating);
        else if (sortBy === 'newest') sortedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setProducts(sortedProducts);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleProductClick = (id) => navigate(`/product/${id}`);

  const handleAddToCart = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await cartAPI.addToCart(id, 1);
      if (res.data.success && window.updateCartCount) window.updateCartCount();
    } catch (err) { console.error(err); }
  };

  const renderStars = (rating) => {
    const num = Number(rating) || 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} color={i < Math.floor(num) ? '#FF9900' : '#C6C6C6'} size={16} />
        ))}
        <span style={{ marginLeft: '5px', color: '#007185', fontSize: '14px' }}>{num.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) return <div style={{ padding: 50 }}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold' }}>Department</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {['Electronics', 'Books', 'Fashion', 'Home'].map(dept => (
              <li key={dept} style={{ padding: '3px 0', fontSize: '14px', cursor: 'pointer', color: '#0F1111' }}
                onClick={() => navigate(`/search?category=${dept}`)}>
                {dept}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <main style={styles.main}>
          <div style={styles.resultsInfo}>
            <span>{products.length === 0 ? 'No results' : `1-${products.length} of ${products.length} results for`} </span>
            <span style={{ color: '#C7511F', fontWeight: 'bold' }}>"{query}"</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {products.map((product, index) => (
              <div
                key={product.id || index}
                style={styles.productCard}
                onClick={() => handleProductClick(product.id)}
              >
                <div style={styles.imageBox}>
                  <img
                    src={product.primary_image || 'https://m.media-amazon.com/images/I/71p-tHQ0u1L._AC_SX679_.jpg'}
                    alt={product.title}
                    style={styles.img}
                    onError={(e) => e.target.src = 'https://m.media-amazon.com/images/I/71p-tHQ0u1L._AC_SX679_.jpg'}
                  />
                </div>
                <div style={styles.info}>
                  <div style={styles.title}>{product.title}</div>

                  <div style={{ marginBottom: '5px' }}>
                    {renderStars(product.rating)}
                    <span style={{ color: '#007185', fontSize: '12px', marginLeft: '5px' }}>
                      ({product.review_count || 500} reviews)
                    </span>
                  </div>

                  <div style={styles.priceRow}>
                    <span style={{ fontSize: '14px' }}>$</span>
                    <span style={styles.priceMain}>{Math.floor(Number(product.price))}</span>
                    <span style={{ fontSize: '14px' }}>{((Number(product.price) % 1) * 100).toFixed(0).padStart(2, '0')}</span>
                  </div>

                  <div style={{ fontSize: '14px', color: '#565959', marginBottom: '10px' }}>
                    FREE Delivery by Amazon
                  </div>

                  <button
                    style={styles.button}
                    onClick={(e) => handleAddToCart(product.id, e)}
                    onMouseOver={(e) => e.target.style.background = '#F7CA00'}
                    onMouseOut={(e) => e.target.style.background = '#FFD814'}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
