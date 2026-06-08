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
    <div className="home-neo">
      {/* ── TICKER ─────────────────────────── */}
      <div className="ticker">
        <div className="ticker-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: 'flex' }}>
              <div className="ticker-item"><span className="ticker-dot"></span> NEW ARRIVALS THIS WEEK</div>
              <div className="ticker-item"><span className="ticker-dot"></span> FREE SHIPPING ON ORDERS OVER ₹999</div>
              <div className="ticker-item"><span className="ticker-dot"></span> ACID WASH COLLECTION LIVE</div>
              <div className="ticker-item"><span className="ticker-dot"></span> UP TO 50% OFF SALE</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HERO ────────────────────────────── */}
      <section className="hero-neo">
        <div className="hero-neo-left">
          <div className="hero-neo-eyebrow">v2.0 / The Future is now</div>
          <h1 className="hero-neo-title">
            <span className="outline">OWN</span> YOUR<br />
            <span className="hot-word">AESTHETIC</span>
          </h1>
          <p className="hero-neo-sub">
            Curated gear for the next generation. No fluff, just pure hype.
            Level up your daily rotation with exclusive drops.
          </p>
          <form onSubmit={handleSearch} className="hero-neo-search">
            <input
              type="text"
              name="heroSearch"
              placeholder="SEARCH DRIP [e.g. sneakers, tech]..."
            />
            <button type="submit" className="btn-acid" style={{ border: 'none', padding: '14px 24px' }}>ENTER</button>
          </form>
          <div className="hero-neo-stats">
            <div>
              <div className="hero-neo-stat-val">10<span>K</span>+</div>
              <div className="hero-neo-stat-label">Hype Beasts</div>
            </div>
            <div>
              <div className="hero-neo-stat-val">500<span>+</span></div>
              <div className="hero-neo-stat-label">Exclusive Drops</div>
            </div>
          </div>
        </div>
        <div className="hero-neo-right">
          <img src="https://images.unsplash.com/photo-1618354691438-25af04751473?q=80&w=1000&auto=format&fit=crop" className="hero-neo-img" alt="Hero" />
          <div className="hero-neo-img-overlay"></div>
          <div className="hero-neo-tag-float one">RESTOCK // RETRO HIGH</div>
          <div className="hero-neo-tag-float two">LTD ED.</div>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────── */}
      <div className="categories-strip-neo">
        <div className="cats-neo-label">VIBE CHECK /</div>
        {categories.map(cat => (
          <Link key={cat._id} to={`/products?category=${cat._id}`} className="cat-neo-chip">
            <i className={`bi ${categoryIcons[cat.slug] || 'bi-grid'} cat-neo-chip-icon`}></i> {cat.name}
          </Link>
        ))}
      </div>

      {/* ── FEATURED PRODUCTS ──────────────── */}
      <section className="section-neo">
        <div className="container-neo">
          <div className="section-neo-head">
            <div>
              <h2 className="section-neo-title"><span className="num">01 //</span> THE HOT LIST</h2>
            </div>
            <Link to="/products" className="section-neo-link">VIEW ALL GEAR <i className="bi bi-arrow-right"></i></Link>
          </div>

          {loading ? <Spinner /> : (
            <div className="grid-neo-4-padded">
              {featured.map(product => (
                <div key={product._id}><ProductCard product={product} /></div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== PROMO BANNERS ===== */}
      <section className="py-5" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px', position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
                <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(108,62,244,0.3), transparent)', borderRadius: '50%' }}></div>
                <span className="badge-warning mb-3 d-inline-block">Limited Time</span>
                <h3 style={{ fontWeight: 800, marginBottom: '10px' }}>Electronics Sale</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Up to 40% off on top brands</p>
                <Link to="/products?category=electronics" className="btn-primary-custom">Shop Now <i className="bi bi-arrow-right"></i></Link>
              </div>
            </div>
            <div className="col-md-6">
              <div style={{ background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px', position: 'relative', overflow: 'hidden', minHeight: '200px' }}>
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

      {/* ── FEATURES STRIP ─────────────────── */}
      <div className="features-neo-strip">
        <div className="feature-neo-item">
          <div className="feature-neo-icon"><i className="bi bi-lightning-fill"></i></div>
          <div>
            <div className="feature-neo-title">FAST AF DELIVERY</div>
            <div className="feature-neo-desc">Same day dispatch. You want it, you get it.</div>
          </div>
        </div>
        <div className="feature-neo-item">
          <div className="feature-neo-icon"><i className="bi bi-shield-check"></i></div>
          <div>
            <div className="feature-neo-title">100% LEGIT</div>
            <div className="feature-neo-desc">No fakes here. Authenticity guaranteed.</div>
          </div>
        </div>
        <div className="feature-neo-item">
          <div className="feature-neo-icon"><i className="bi bi-arrow-return-left"></i></div>
          <div>
            <div className="feature-neo-title">NO BS RETURNS</div>
            <div className="feature-neo-desc">Don't like it? Send it back. No questions.</div>
          </div>
        </div>
      </div>

      {/* ── NEWSLETTER ─────────────────────── */}
      <section className="newsletter-neo">
        <div>
          <h2 className="newsletter-neo-title">DON'T SLEEP <span className="accent">ON THIS</span>.</h2>
          <p className="newsletter-neo-sub">Join the cult. Get early access to exclusive drops, secret sales, and the acid wash aesthetic directly to your inbox.</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); alert('JOINED THE CULT.'); setEmail(''); }} className="newsletter-neo-form">
          <input
            type="email"
            placeholder="ENTER YOUR EMAIL //"
            className="newsletter-neo-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn-acid" style={{ justifyContent: 'space-between' }}>
            JOIN THE CULT <i className="bi bi-arrow-right"></i>
          </button>
        </form>
      </section>
    </div>
  );
};

export default Home;
