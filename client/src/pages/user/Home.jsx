import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedProductsAPI, getCategoriesAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import Spinner from '../../components/Spinner/Spinner';

const categoryIcons = {
  electronics: 'bi-cpu',
  fashion: 'bi-bag',
  'home-living': 'bi-house',
  sports: 'bi-trophy',
  books: 'bi-book',
  beauty: 'bi-stars',
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, catRes] = await Promise.all([getFeaturedProductsAPI(), getCategoriesAPI()]);
        setFeatured(featRes.data);
        setCategories(catRes.data);
      } catch (err) { /* silent */ } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.elements.heroSearch?.value;
    if (q?.trim()) navigate(`/products?keyword=${q.trim()}`);
  };

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="mb-3">
                <span className="badge-primary"><i className="bi bi-lightning-fill me-1"></i> New Arrivals Every Week</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '20px' }}>
                Discover <span className="gradient-text">Amazing</span><br />Products Online
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '450px' }}>
                Shop from thousands of premium products with lightning-fast delivery and best-in-class customer support.
              </p>
              <form onSubmit={handleSearch} className="d-flex gap-3 flex-wrap mb-4">
                <div style={{ flex: 1, minWidth: '260px', background: 'var(--dark-3)', border: '1px solid var(--border)', borderRadius: '50px', display: 'flex', alignItems: 'center', padding: '12px 20px', gap: '10px' }}>
                  <i className="bi bi-search" style={{ color: 'var(--text-muted)' }}></i>
                  <input name="heroSearch" type="text" placeholder="What are you looking for?" style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontFamily: 'Outfit', fontSize: '15px', flex: 1 }} />
                </div>
                <button type="submit" className="btn-primary-custom" style={{ borderRadius: '50px', padding: '12px 28px' }}>
                  Search <i className="bi bi-search"></i>
                </button>
              </form>
              <div className="d-flex align-items-center gap-4 flex-wrap" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                {[['bi-truck', 'Free Shipping'], ['bi-shield-check', 'Secure Payment'], ['bi-arrow-repeat', 'Easy Returns']].map(([icon, text]) => (
                  <span key={text} className="d-flex align-items-center gap-1">
                    <i className={`bi ${icon}`} style={{ color: 'var(--primary-light)' }}></i> {text}
                  </span>
                ))}
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0 text-center">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{ width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,62,244,0.3) 0%, transparent 70%)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                <img src="https://picsum.photos/seed/shopzone/500/450" alt="Shopping" style={{ maxWidth: '100%', borderRadius: '24px', position: 'relative', zIndex: 1, boxShadow: '0 30px 80px rgba(108,62,244,0.3)' }} />
                <div style={{ position: 'absolute', top: '20px', right: '-20px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '14px 18px', zIndex: 2, boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Today's Sales</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }} className="gradient-text">₹1.2M+</div>
                </div>
                <div style={{ position: 'absolute', bottom: '30px', left: '-30px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '16px', padding: '14px 18px', zIndex: 2, boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Happy Customers</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }} className="gradient-text">50K+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-5" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <div className="section-divider"></div>
            <p>Explore our wide range of product categories</p>
          </div>
          <div className="row g-3">
            {categories.map(cat => (
              <div key={cat._id} className="col-6 col-md-4 col-lg-2">
                <Link to={`/products?category=${cat._id}`} className="text-decoration-none">
                  <div className="card-custom text-center" style={{ padding: '24px 16px', cursor: 'pointer' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(108,62,244,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: '24px', color: 'var(--primary-light)' }}>
                      <i className={`bi ${categoryIcons[cat.slug] || 'bi-grid'}`}></i>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{cat.name}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-5">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <div className="section-divider"></div>
            <p>Handpicked deals just for you</p>
          </div>
          {loading ? <Spinner /> : (
            <>
              <div className="row g-4">
                {featured.map(p => (
                  <div key={p._id} className="col-6 col-md-4 col-lg-3">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-5">
                <Link to="/products" className="btn-primary-custom" style={{ padding: '14px 40px', fontSize: '15px', borderRadius: '50px' }}>
                  View All Products <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ===== PROMO BANNERS ===== */}
      <section className="py-5" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div style={{ background: 'linear-gradient(135deg, #1a0a3e, #2d1060)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px', position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
                <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(108,62,244,0.3), transparent)', borderRadius: '50%' }}></div>
                <span className="badge-warning mb-3 d-inline-block">Limited Time</span>
                <h3 style={{ fontWeight: 800, marginBottom: '10px' }}>Electronics Sale</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Up to 40% off on top brands</p>
                <Link to="/products?category=electronics" className="btn-primary-custom">Shop Now <i className="bi bi-arrow-right"></i></Link>
              </div>
            </div>
            <div className="col-md-6">
              <div style={{ background: 'linear-gradient(135deg, #1a0f05, #3d1a05)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px', position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
                <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(249,115,22,0.3), transparent)', borderRadius: '50%' }}></div>
                <span className="badge-secondary mb-3 d-inline-block">New Arrivals</span>
                <h3 style={{ fontWeight: 800, marginBottom: '10px' }}>Fashion Picks</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Trending styles at best prices</p>
                <Link to="/products?category=fashion" className="btn-outline-custom">Explore <i className="bi bi-arrow-right"></i></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {[
              { icon: 'bi-truck', title: 'Free Delivery', desc: 'On orders above ₹499', color: 'purple' },
              { icon: 'bi-shield-check', title: 'Secure Payment', desc: '100% secure transactions', color: 'green' },
              { icon: 'bi-headset', title: '24/7 Support', desc: 'Always here to help you', color: 'cyan' },
              { icon: 'bi-arrow-repeat', title: 'Easy Returns', desc: '30-day return policy', color: 'orange' },
            ].map(({ icon, title, desc, color }) => (
              <div key={title} className="col-6 col-md-3">
                <div className="stat-card" style={{ flexDirection: 'column', textAlign: 'center' }}>
                  <div className={`stat-icon ${color}`} style={{ margin: '0 auto 12px' }}>
                    <i className={`bi ${icon}`}></i>
                  </div>
                  <div style={{ fontWeight: 700, marginBottom: '4px' }}>{title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="py-5" style={{ background: 'linear-gradient(135deg, rgba(108,62,244,0.15), rgba(6,182,212,0.1))' }}>
        <div className="container text-center">
          <h2 style={{ fontWeight: 800, marginBottom: '12px' }}>Stay in the Loop</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Subscribe to get exclusive deals and offers</p>
          <form onSubmit={e => { e.preventDefault(); alert('Subscribed! 🎉'); setEmail(''); }} className="d-flex gap-3 justify-content-center flex-wrap">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{ maxWidth: '360px', width: '100%' }}
              className="form-control-custom"
            />
            <button type="submit" className="btn-primary-custom" style={{ padding: '12px 32px', borderRadius: '50px' }}>
              Subscribe <i className="bi bi-send-fill"></i>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
