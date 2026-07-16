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
            <span className="outline">OWN</span> YOUR<br/>
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

      {/* ── BENTO PROMO ────────────────────── */}
      <section className="section-neo" style={{ paddingTop: 0 }}>
        <div className="container-neo">
          <div className="section-neo-head">
            <h2 className="section-neo-title"><span className="num">02 //</span> CURATED DROPS</h2>
          </div>
          
          <div className="promo-neo-grid">
            <div className="promo-neo-cell span-2 span-row-2">
              <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop" alt="Cyber Gear" />
              <div className="promo-neo-overlay">
                <div className="promo-neo-tag">ACID COLLECTION</div>
                <div className="promo-neo-title">CYBER GEAR V1</div>
                <Link to="/products" className="promo-neo-cta">SHOP DROP <i className="bi bi-arrow-right"></i></Link>
              </div>
            </div>
            <div className="promo-neo-cell">
              <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=400&auto=format&fit=crop" alt="Sneakers" />
              <div className="promo-neo-overlay">
                <div className="promo-neo-tag">FOOTWEAR</div>
                <div className="promo-neo-title">SNEAKERS</div>
              </div>
            </div>
            <div className="promo-neo-cell">
              <div className="promo-neo-overlay dark" style={{ background: 'var(--ink)' }}>
                <div className="promo-neo-stat">50%</div>
                <div className="promo-neo-stat-label">OFF EVERYTHING</div>
              </div>
            </div>
            <div className="promo-neo-cell span-2" style={{ background: 'var(--acid)' }}>
              <div className="promo-neo-overlay" style={{ background: 'none' }}>
                <div className="promo-neo-tag" style={{ color: 'var(--ink)' }}>TECH ACCS</div>
                <div className="promo-neo-title" style={{ color: 'var(--ink)' }}>GAME ON.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ─────────────────── */}
      <div className="container-neo" style={{ paddingBottom: '80px' }}>
        <div className="features-neo-strip" style={{ borderLeft: '2px solid var(--ink)', borderRight: '2px solid var(--ink)' }}>
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
