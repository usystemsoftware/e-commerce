import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-neo">
      <div className="footer-neo-grid">
        <div>
          <Link to="/" className="footer-neo-logo text-decoration-none">SHOP<span>ZONE</span></Link>
          <p className="footer-neo-desc">We don't just follow trends. We make them. Welcome to the new era of online streetwear & tech.</p>
          <div className="footer-neo-social">
            <button className="social-neo-btn"><i className="bi bi-twitter-x"></i></button>
            <button className="social-neo-btn"><i className="bi bi-instagram"></i></button>
            <button className="social-neo-btn"><i className="bi bi-youtube"></i></button>
            <button className="social-neo-btn"><i className="bi bi-tiktok"></i></button>
          </div>
        </div>
        <div>
          <div className="footer-neo-col-title">SHOP</div>
          <ul className="footer-neo-links">
            <li><Link to="/products">ALL PRODUCTS</Link></li>
            <li><Link to="/products?category=electronics">ELECTRONICS</Link></li>
            <li><Link to="/products?category=fashion">FASHION</Link></li>
            <li><Link to="/products?category=beauty">BEAUTY</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-neo-col-title">SUPPORT</div>
          <ul className="footer-neo-links">
            <li><Link to="#">FAQ</Link></li>
            <li><Link to="#">SHIPPING INFO</Link></li>
            <li><Link to="#">RETURNS</Link></li>
            <li><Link to="#">CONTACT US</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-neo-col-title">LEGAL</div>
          <ul className="footer-neo-links">
            <li><Link to="#">TERMS & CONDITIONS</Link></li>
            <li><Link to="#">PRIVACY POLICY</Link></li>
            <li><Link to="#">COOKIE POLICY</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-neo-bottom">
        <div className="footer-neo-copy">© {new Date().getFullYear()} SHOPZONE. ALL RIGHTS RESERVED.</div>
        <div className="footer-neo-trust">
          <div className="trust-neo-badge"><i className="bi bi-shield-check" style={{ fontSize: '14px', color: 'var(--acid)' }}></i> SECURE CHECKOUT</div>
          <div className="trust-neo-badge"><i className="bi bi-globe" style={{ fontSize: '14px', color: 'var(--acid)' }}></i> WORLDWIDE SHIPPING</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
