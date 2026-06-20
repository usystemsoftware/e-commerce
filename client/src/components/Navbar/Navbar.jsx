import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiChevronDown, FiLayers } from 'react-icons/fi';

const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home-living', name: 'Home & Living' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'sports', name: 'Sports' },
  { id: 'books', name: 'Books' },
  { id: 'appliances', name: 'Appliances' },
  { id: 'grocery', name: 'Grocery' }
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword.trim()}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="mp-navbar-wrapper">
      {/* Top Navbar Tier */}
      <div className="mp-navbar-top">
        {/* Logo */}
        <Link to="/" className="mp-logo">
          SHOP<span>ZONE</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mp-search-container">
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">
            <FiSearch />
          </button>
        </form>

        {/* Action Icons */}
        <div className="mp-nav-actions">
          {user ? (
            <div className="dropdown">
              <div className="mp-action-btn" data-bs-toggle="dropdown">
                <FiUser size={20} />
                <span>{user.name?.split(' ')[0]}</span>
                <FiChevronDown size={14} />
              </div>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm" style={{ marginTop: '12px' }}>
                <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                <li><Link className="dropdown-item" to="/orders">Orders</Link></li>
                {user.role === 'admin' && (
                  <li><Link className="dropdown-item" to="/admin/dashboard">Admin Dashboard</Link></li>
                )}
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="mp-action-btn">
              <FiUser size={20} />
              <span>Login</span>
            </Link>
          )}

          <Link to="/compare" className="mp-action-btn">
            <FiLayers size={20} />
            <span>Compare</span>
          </Link>

          <Link to="/wishlist" className="mp-action-btn">
            <FiHeart size={20} />
            <span>Wishlist</span>
            {wishlistCount > 0 && <span className="mp-badge">{wishlistCount}</span>}
          </Link>

          <Link to="/cart" className="mp-action-btn">
            <FiShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && <span className="mp-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* Bottom Categories Tier */}
      <div className="mp-navbar-bottom">
        <div className="mp-categories-nav">
          <Link to="/products" className="mp-cat-link" style={{ fontWeight: '600' }}>
            <FiMenu style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            All Categories
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} className="mp-cat-link">
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
