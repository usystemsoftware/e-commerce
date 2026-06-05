import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>
              <span className="gradient-text"><i className="bi bi-bag-heart-fill me-2"></i>ShopZone</span>
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7' }}>
              Your ultimate destination for online shopping. Quality products, unbeatable prices, delivered to your door.
            </p>
            <div className="social-icons mt-3">
              {['facebook', 'twitter', 'instagram', 'youtube'].map(s => (
                <a key={s} href="#" className="social-icon"><i className={`bi bi-${s}`}></i></a>
              ))}
            </div>
          </div>
          <div className="col-6 col-lg-2 mb-4">
            <h5>Shop</h5>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=electronics">Electronics</Link></li>
              <li><Link to="/products?category=fashion">Fashion</Link></li>
              <li><Link to="/products?category=beauty">Beauty</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2 mb-4">
            <h5>Account</h5>
            <ul>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2 mb-4">
            <h5>Help</h5>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2 mb-4">
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopZone. All rights reserved. Made with ❤️ using MERN Stack.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
