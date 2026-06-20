import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPagesAPI, subscribeAPI } from '../../services/api';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Footer = () => {
  const [pages, setPages] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    getPagesAPI().then(res => setPages(res.data)).catch(() => {});
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await subscribeAPI({ email });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="mp-footer">
      <div className="mp-footer-grid">
        <div className="mp-footer-col">
          <h4>About Us</h4>
          <Link to="/contact">Contact Us</Link>
          <Link to="/page/about-us">About Us</Link>
          <Link to="/page/careers">Careers</Link>
          <Link to="/page/stories">ShopZone Stories</Link>
          <Link to="/page/press">Press</Link>
          <Link to="/page/wholesale">Wholesale</Link>
          <Link to="/page/corporate">Corporate Information</Link>
        </div>

        <div className="mp-footer-col">
          <h4>Help Center</h4>
          <Link to="/page/payments">Payments</Link>
          <Link to="/page/shipping">Shipping</Link>
          <Link to="/page/cancellation">Cancellation & Returns</Link>
          <Link to="/page/faq">FAQ</Link>
          <Link to="/page/report">Report Infringement</Link>
        </div>

        <div className="mp-footer-col">
          <h4>Consumer Policy</h4>
          {pages.length > 0 ? (
            pages.map(page => (
              <Link key={page._id} to={`/page/${page.slug}`}>{page.title}</Link>
            ))
          ) : (
            <>
              <Link to="/page/terms">Terms Of Use</Link>
              <Link to="/page/security">Security</Link>
              <Link to="/page/privacy">Privacy</Link>
              <Link to="/page/sitemap">Sitemap</Link>
              <Link to="/page/grievance">Grievance Redressal</Link>
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
            <h4>Newsletter</h4>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none', flex: 1, color: '#333' }}
              />
              <button 
                type="submit" 
                disabled={subscribing}
                style={{ padding: '8px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                {subscribing ? '...' : 'Subscribe'}
              </button>
            </form>
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
