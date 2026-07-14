import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/products?keyword=${keyword.trim()}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className={`nav-neo ${!isHome ? 'light-mode' : ''}`}>
        <Link to="/" className="nav-neo-logo">SHOP<span>ZONE</span></Link>
        <form onSubmit={handleSearch} className="nav-neo-search" style={{ margin: 0 }}>
          <input 
            type="text" 
            placeholder="SEARCH [e.g. tees, hoodies]..." 
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
          <button type="submit" style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>
            <i className="bi bi-search"></i>
          </button>
        </form>
        <div className="nav-neo-actions">
          {user ? (
            <div className="dropdown">
              <div className="nav-neo-sign" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} data-bs-toggle="dropdown">
                {user.name?.split(' ')[0].toUpperCase()} / <i className="bi bi-chevron-down" style={{ fontSize: '12px' }}></i>
              </div>
              <ul className="dropdown-menu dropdown-menu-end" style={{ background: 'var(--ink)', border: '2px solid var(--ink-3)', borderRadius: 0, marginTop: '10px' }}>
                <li><Link className="dropdown-item" style={{ color: 'var(--chalk)', fontFamily: 'var(--font-mono)' }} to="/profile">PROFILE</Link></li>
                <li><Link className="dropdown-item" style={{ color: 'var(--chalk)', fontFamily: 'var(--font-mono)' }} to="/orders">ORDERS</Link></li>
                {user.role === 'admin' && (
                  <li><Link className="dropdown-item" style={{ color: 'var(--acid)', fontFamily: 'var(--font-mono)' }} to="/admin/dashboard">ADMIN</Link></li>
                )}
                <li><hr className="dropdown-divider" style={{ borderColor: 'var(--ink-3)' }} /></li>
                <li><button className="dropdown-item" style={{ color: 'var(--hot)', fontFamily: 'var(--font-mono)' }} onClick={handleLogout}>LOGOUT</button></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="nav-neo-sign text-decoration-none">SIGN IN /</Link>
          )}

          <Link to="/wishlist" className="nav-neo-btn">
            <i className="bi bi-heart"></i>
            {wishlistCount > 0 && <span className="nav-neo-badge">{wishlistCount}</span>}
          </Link>
          <Link to="/cart" className="nav-neo-btn">
            <i className="bi bi-bag"></i>
            {cartCount > 0 && <span className="nav-neo-badge">{cartCount}</span>}
          </Link>
        </div>
      </nav>
      
      {/* Category nav */}
      <div style={{ background: isHome ? 'var(--ink-2)' : '#ffffff', borderBottom: isHome ? '2px solid var(--ink)' : '1px solid #eaeaea', padding: '10px 48px', display: 'flex', gap: '24px', flexWrap: 'wrap', overflowX: 'auto' }}>
        <Link to="/products" className={`category-link ${!searchParams.get('category') ? 'active' : ''}`}>All Products</Link>
        <Link to="/products?category=electronics" className={`category-link ${searchParams.get('category') === 'electronics' ? 'active' : ''}`}>Electronics</Link>
        <Link to="/products?category=fashion" className={`category-link ${searchParams.get('category') === 'fashion' ? 'active' : ''}`}>Fashion</Link>
        <Link to="/products?category=home-living" className={`category-link ${searchParams.get('category') === 'home-living' ? 'active' : ''}`}>Home & Living</Link>
        <Link to="/products?category=sports" className={`category-link ${searchParams.get('category') === 'sports' ? 'active' : ''}`}>Sports</Link>
        <Link to="/products?category=beauty" className={`category-link ${searchParams.get('category') === 'beauty' ? 'active' : ''}`}>Beauty</Link>
        <Link to="/products?category=books" className={`category-link ${searchParams.get('category') === 'books' ? 'active' : ''}`}>Books</Link>
      </div>
    </>
  );
};

export default Navbar;
