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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/products?keyword=${keyword.trim()}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar-custom">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
          {/* Brand */}
          <Link to="/" className="navbar-brand-custom text-decoration-none">
            <i className="bi bi-bag-heart-fill me-2"></i>ShopZone
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-grow-1" style={{ maxWidth: '450px' }}>
            <div className="search-bar-nav">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search products, brands..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-light)' }}>
                <i className="bi bi-arrow-right-circle-fill"></i>
              </button>
            </div>
          </form>

          {/* Icons */}
          <div className="d-flex align-items-center gap-2">
            <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
              <i className="bi bi-heart"></i>
              {wishlistCount > 0 && <span className="nav-badge">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="nav-icon-btn" title="Cart">
              <i className="bi bi-bag"></i>
              {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
            </Link>

            {user ? (
              <div className="dropdown">
                <button className="nav-icon-btn" data-bs-toggle="dropdown" style={{ cursor: 'pointer' }}>
                  <i className="bi bi-person-circle"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', minWidth: '180px' }}>
                  <li><span className="dropdown-item-text" style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '8px 16px' }}>Hi, {user.name?.split(' ')[0]}</span></li>
                  <li><hr className="dropdown-divider" style={{ borderColor: 'var(--border)' }} /></li>
                  <li><Link className="dropdown-item" style={{ color: 'var(--text-secondary)' }} to="/profile">My Profile</Link></li>
                  <li><Link className="dropdown-item" style={{ color: 'var(--text-secondary)' }} to="/orders">My Orders</Link></li>
                  {user.role === 'admin' && (
                    <li><Link className="dropdown-item" style={{ color: 'var(--primary-light)' }} to="/admin/dashboard">Admin Panel</Link></li>
                  )}
                  <li><hr className="dropdown-divider" style={{ borderColor: 'var(--border)' }} /></li>
                  <li><button className="dropdown-item" style={{ color: 'var(--danger)' }} onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn-primary-custom" style={{ padding: '8px 20px', fontSize: '14px' }}>
                <i className="bi bi-person"></i> Login
              </Link>
            )}
          </div>
        </div>

        {/* Category nav */}
        <div className="d-flex align-items-center gap-3 mt-2 flex-wrap" style={{ paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
          <Link to="/products" style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>All Products</Link>
          <Link to="/products?category=electronics" style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Electronics</Link>
          <Link to="/products?category=fashion" style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Fashion</Link>
          <Link to="/products?category=home-living" style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Home & Living</Link>
          <Link to="/products?category=sports" style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Sports</Link>
          <Link to="/products?category=beauty" style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Beauty</Link>
          <Link to="/products?category=books" style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>Books</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
