import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useState } from 'react';

const megaMenuData = {
  electronics: [
    { name: "Smartphones", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&q=80" },
    { name: "Laptops", img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&q=80" },
    { name: "Smart TVs", img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=150&q=80" },
    { name: "Audio", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&q=80" },
    { name: "Cameras", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=150&q=80" }
  ],
  fashion: [
    { name: "Men's Wear", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=150&q=80" },
    { name: "Women's Wear", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&q=80" },
    { name: "Kids' Wear", img: "https://images.unsplash.com/photo-1519238263530-99abca9665ae?w=150&q=80" },
    { name: "Shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80" }
  ],
  "home-living": [
    { name: "Furniture", img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=150&q=80" },
    { name: "Decor", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&q=80" },
    { name: "Kitchen", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=150&q=80" },
    { name: "Bedding", img: "https://images.unsplash.com/photo-1522771731536-601e32717081?w=150&q=80" }
  ],
  sports: [
    { name: "Fitness", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=150&q=80" },
    { name: "Shoes", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=150&q=80" },
    { name: "Activewear", img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=150&q=80" },
    { name: "Equipment", img: "https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?w=150&q=80" }
  ],
  beauty: [
    { name: "Makeup", img: "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=150&q=80" },
    { name: "Skincare", img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=150&q=80" },
    { name: "Haircare", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=150&q=80" },
    { name: "Fragrances", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=150&q=80" }
  ],
  books: [
    { name: "Fiction", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&q=80" },
    { name: "Non-Fiction", img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=150&q=80" },
    { name: "Academic", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=150&q=80" },
    { name: "Children's", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&q=80" }
  ]
};

const categoryLabels = {
  electronics: { label: "Consumer Electronics", icon: "bi-laptop", shortLabel: "Electronics" },
  fashion: { label: "Apparel & Accessories", icon: "bi-bag", shortLabel: "Fashion" },
  "home-living": { label: "Home & Furniture", icon: "bi-house", shortLabel: "Home & Living" },
  sports: { label: "Sports & Entertainment", icon: "bi-bicycle", shortLabel: "Sports" },
  beauty: { label: "Beauty & Personal Care", icon: "bi-stars", shortLabel: "Beauty" },
  books: { label: "Books & Literature", icon: "bi-book", shortLabel: "Books" }
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [activeMegaCategory, setActiveMegaCategory] = useState('electronics');

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/products?keyword=${keyword.trim()}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const singleCategories = ['electronics', 'fashion', 'home-living', 'sports', 'beauty', 'books'];

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
          <div className="ajio-nav-item mega-menu-wrapper">
            <Link to="/products" className={`ajio-nav-link ${!searchParams.get('category') ? 'active' : ''}`}>
              All Categories <i className="bi bi-chevron-down"></i>
            </Link>
            <div className="mega-menu-container">
              <div className="mega-menu-sidebar">
                <div className="mega-menu-sidebar-title">Categories for you</div>
                <ul>
                  {Object.keys(categoryLabels).map((key) => (
                    <li 
                      key={key} 
                      className={activeMegaCategory === key ? 'active' : ''}
                      onMouseEnter={() => setActiveMegaCategory(key)}
                    >
                      <Link to={`/products?category=${key}`}>
                        <i className={`bi ${categoryLabels[key].icon}`}></i> {categoryLabels[key].label}
                      </Link>
                      <i className="bi bi-chevron-right chevron-right"></i>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mega-menu-content">
                <div className="mega-menu-content-title">
                  {categoryLabels[activeMegaCategory]?.label}
                </div>
                <div className="mega-category-grid">
                  {megaMenuData[activeMegaCategory]?.map((sub, idx) => (
                    <Link to={`/products?category=${activeMegaCategory}&keyword=${sub.name.toLowerCase()}`} key={idx} className="mega-category-card">
                      <div className="mega-category-img-wrap">
                        <img src={sub.img} alt={sub.name} />
                        <span className="hot-badge"><i className="bi bi-fire"></i></span>
                      </div>
                      <span className="mega-category-name">{sub.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {singleCategories.map(cat => (
            <div key={cat} className="ajio-nav-item mega-menu-wrapper">
              <Link to={`/products?category=${cat}`} className={`ajio-nav-link ${searchParams.get('category') === cat ? 'active' : ''}`}>
                {categoryLabels[cat].shortLabel} <i className="bi bi-chevron-down"></i>
              </Link>
              <div className="mega-menu-container mini-mega">
                <div className="mega-menu-content mini-content">
                  <div className="mega-category-grid mini-grid">
                    {megaMenuData[cat]?.map((sub, idx) => (
                      <Link to={`/products?category=${cat}&keyword=${sub.name.toLowerCase()}`} key={idx} className="mega-category-card">
                        <div className="mega-category-img-wrap mini-img-wrap">
                          <img src={sub.img} alt={sub.name} />
                        </div>
                        <span className="mega-category-name mini-name">{sub.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

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
