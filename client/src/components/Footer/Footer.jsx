import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPagesAPI } from '../../services/api';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    getPagesAPI().then(res => setPages(res.data)).catch(() => {});
  }, []);

  return (
    <footer className="mp-footer">
      <div className="mp-footer-grid">
        <div className="mp-footer-col">
          <h4>About Us</h4>
          <Link to="/about">Contact Us</Link>
          <Link to="/about">About Us</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/stories">ShopZone Stories</Link>
          <Link to="/press">Press</Link>
          <Link to="/wholesale">Wholesale</Link>
          <Link to="/corporate">Corporate Information</Link>
        </div>

        <div className="mp-footer-col">
          <h4>Help Center</h4>
          <Link to="/payments">Payments</Link>
          <Link to="/shipping">Shipping</Link>
          <Link to="/cancellation">Cancellation & Returns</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/report">Report Infringement</Link>
        </div>

        <div className="mp-footer-col">
          <h4>Consumer Policy</h4>
          {pages.length > 0 ? (
            pages.map(page => (
              <Link key={page._id} to={`/page/${page.slug}`}>{page.title}</Link>
            ))
          ) : (
            <>
              <Link to="/terms">Terms Of Use</Link>
              <Link to="/security">Security</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/sitemap">Sitemap</Link>
              <Link to="/grievance">Grievance Redressal</Link>
            </>
          )}
        </div>

        <div className="mp-footer-col">
          <h4>Social Media</h4>
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '20px' }}><FiFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '20px' }}><FiTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '20px' }}><FiInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: '20px' }}><FiYoutube /></a>
          </div>
          <div style={{ marginTop: '20px' }}>
            <h4>Registered Office Address:</h4>
            <p style={{ fontSize: '12px', color: '#878787', lineHeight: '1.5', margin: 0 }}>
              ShopZone Internet Private Limited, <br/>
              Buildings Alyssa, Begonia & <br/>
              Clove Embassy Tech Village, <br/>
              Outer Ring Road, Devarabeesanahalli Village, <br/>
              Bengaluru, 560103, <br/>
              Karnataka, India
            </p>
          </div>
        </div>
      </div>
      <div className="mp-footer-bottom">
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} ShopZone.com. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
