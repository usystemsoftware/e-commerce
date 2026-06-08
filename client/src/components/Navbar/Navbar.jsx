import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/products?keyword=${keyword.trim()}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="ajio-navbar-wrapper">
      <div className="ajio-topbar">
        <div className="ajio-topbar-links">
          {user ? (
            <div className="dropdown">
              <span className="ajio-topbar-link" data-bs-toggle="dropdown" style={{ cursor: 'pointer' }}>
                {user.name?.split(' ')[0].toUpperCase()} / <i className="bi bi-chevron-down" style={{ fontSize: '10px' }}></i>
              </span>
              <ul className="dropdown-menu dropdown-menu-end" style={{ borderRadius: 0, marginTop: '10px', fontSize: '14px' }}>
                <li><Link className="dropdown-item" to="/profile">PROFILE</Link></li>
                <li><Link className="dropdown-item" to="/orders">ORDERS</Link></li>
                {user.role === 'admin' && (
                  <li><Link className="dropdown-item" to="/admin/dashboard">ADMIN</Link></li>
                )}
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}>LOGOUT</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="ajio-topbar-link">SIGN IN /</Link>
          )}
        </div>
      </div>

      <div className="ajio-mainbar">
        <Link to="/" className="ajio-brand">SHOP<span>ZONE</span></Link>
        <nav className="ajio-nav-links">
          <Link to="/products" className={`ajio-nav-link ${!searchParams.get('category') ? 'active' : ''}`}>All Products <i className="bi bi-chevron-down"></i></Link>
          <Link to="/products?category=electronics" className={`ajio-nav-link ${searchParams.get('category') === 'electronics' ? 'active' : ''}`}>Electronics <i className="bi bi-chevron-down"></i></Link>
          <Link to="/products?category=fashion" className={`ajio-nav-link ${searchParams.get('category') === 'fashion' ? 'active' : ''}`}>Fashion <i className="bi bi-chevron-down"></i></Link>
          <Link to="/products?category=home-living" className={`ajio-nav-link ${searchParams.get('category') === 'home-living' ? 'active' : ''}`}>Home & Living <i className="bi bi-chevron-down"></i></Link>
          <Link to="/products?category=sports" className={`ajio-nav-link ${searchParams.get('category') === 'sports' ? 'active' : ''}`}>Sports <i className="bi bi-chevron-down"></i></Link>
          <Link to="/products?category=beauty" className={`ajio-nav-link ${searchParams.get('category') === 'beauty' ? 'active' : ''}`}>Beauty <i className="bi bi-chevron-down"></i></Link>
          <Link to="/products?category=books" className={`ajio-nav-link ${searchParams.get('category') === 'books' ? 'active' : ''}`}>Books <i className="bi bi-chevron-down"></i></Link>
        </nav>
        
        <div className="ajio-tools">
          <form onSubmit={handleSearch} className="ajio-search-box">
            <input 
              type="text" 
              placeholder="SEARCH [e.g. tees, hoodies]..." 
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <button type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>
          <Link to="/wishlist" className="ajio-icon-circle">
            <i className="bi bi-heart"></i>
            {wishlistCount > 0 && <span className="ajio-badge-count">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="ajio-icon-circle">
            <i className="bi bi-bag"></i>
            {cartCount > 0 && <span className="ajio-badge-count">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
