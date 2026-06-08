import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProductsAPI, getCategoriesAPI, getActiveBannersAPI } from '../../services/api';
import Spinner from '../../components/Spinner/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { FiHeart, FiChevronRight, FiClock } from 'react-icons/fi';
import 'react-lazy-load-image-component/src/effects/blur.css';

const defaultCategoryIcon = 'https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png?q=100';

const testimonials = [
  { id: 1, name: "Rahul S.", review: "Excellent product quality and very fast delivery. The customer service was also very helpful when I had a query.", rating: 5, img: "https://i.pravatar.cc/150?img=11" },
  { id: 2, name: "Priya M.", review: "I love the new UI, it makes shopping so much easier. Will definitely recommend ShopZone to my friends and family.", rating: 5, img: "https://i.pravatar.cc/150?img=5" },
  { id: 3, name: "Amit K.", review: "Got my smartphone at a huge discount during the flash sale. Genuine product, sealed box. Thumbs up!", rating: 4, img: "https://i.pravatar.cc/150?img=15" },
  { id: 4, name: "Neha G.", review: "The home and living section has some really aesthetic items. Delivery packaging was safe and secure.", rating: 5, img: "https://i.pravatar.cc/150?img=20" },
];

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff6161', fontWeight: '600' }}>
      <FiClock /> {h}h : {m}m : {s}s Left
    </div>
  );
};

const ProductCard = ({ product }) => {
  const imgUrl = product.images?.[0] || 'https://via.placeholder.com/150';
  const displayImg = imgUrl.startsWith('http') ? imgUrl : `http://localhost:5000${imgUrl}`;
  const discount = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <motion.div whileHover={{ y: -5 }} className="mp-product-card">
      <div className="mp-wishlist-btn"><FiHeart /></div>
      <Link to={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="mp-product-image-container">
          <LazyLoadImage src={displayImg} alt={product.name} effect="blur" className="mp-product-image" />
        </div>
        <div className="mp-product-title">{product.name}</div>
        <div className="mp-product-rating">
          {product.ratings || '4.0'} ★
        </div>
        <div className="mp-product-price-container">
          <span className="mp-price">₹{product.price}</span>
          {product.originalPrice && <span className="mp-original-price">₹{product.originalPrice}</span>}
          {discount > 0 && <span className="mp-discount">{discount}% off</span>}
        </div>
      </Link>
      <button className="mp-add-cart-btn">Add to Cart</button>
    </motion.div>
  );
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try { const featRes = await getFeaturedProductsAPI(); setFeatured(featRes.data); } catch (e) {}
      try { const catRes = await getCategoriesAPI(); setCategories(catRes.data); } catch (e) {}
      try { const bannerRes = await getActiveBannersAPI(); if (bannerRes.data?.length > 0) setBanners(bannerRes.data); } catch (e) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* ── HERO CAROUSEL ──────────────────────── */}
      <div className="mp-hero-section">
        {banners.length > 0 ? (
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            loop
            className="mySwiper"
          >
            {banners.map(banner => (
              <SwiperSlide key={banner._id}>
                <Link to={banner.linkUrl || '#'}>
                  <img 
                    src={banner.imageUrl.startsWith('http') ? banner.imageUrl : `http://localhost:5000${banner.imageUrl}`} 
                    className="mp-hero-slide" 
                    alt={banner.title} 
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&h=350&auto=format&fit=crop" className="mp-hero-slide" alt="Placeholder Hero" />
        )}
      </div>

      {/* ── CATEGORIES STRIP ──────────────────────── */}
      <div className="mp-category-strip">
        {categories.map(cat => (
          <motion.div key={cat._id} whileHover={{ scale: 1.05 }}>
            <Link to={`/products?category=${cat._id}`} className="mp-cat-strip-item">
              <img src={defaultCategoryIcon} alt={cat.name} className="mp-cat-strip-img" />
              <span className="mp-cat-strip-name">{cat.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '50px 0' }}><Spinner /></div>
      ) : (
        <>
          {/* ── FLASH SALE SECTION ──────────────── */}
          {featured.length > 0 && (
            <div className="mp-section" style={{ background: '#f5f7fa', padding: '0', boxShadow: 'none' }}>
              <div style={{ background: '#fff', padding: '20px', boxShadow: 'var(--mp-shadow)', borderRadius: '4px' }}>
                <div className="mp-section-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h2 className="mp-section-title">Deal of the Day</h2>
                    <CountdownTimer />
                  </div>
                  <Link to="/products" className="mp-view-all-btn">VIEW ALL</Link>
                </div>
                <Swiper
                  modules={[Navigation]}
                  navigation
                  spaceBetween={16}
                  slidesPerView={1}
                  breakpoints={{
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1200: { slidesPerView: 5 }
                  }}
                >
                  {featured.map(product => (
                    <SwiperSlide key={`flash-${product._id}`}>
                      <ProductCard product={product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}

          {/* ── PROMO BANNER ──────────────── */}
          <div className="mp-promo-banner">
            <img src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=1600&h=200&auto=format&fit=crop" alt="Promo Banner" className="mp-promo-img" style={{ height: '200px', objectFit: 'cover' }} />
          </div>

          {/* ── BEST SELLERS GRID ──────────────── */}
          {featured.length > 0 && (
            <div className="mp-section">
              <div className="mp-section-header">
                <h2 className="mp-section-title">Best Sellers</h2>
              </div>
              <div className="mp-product-grid">
                {featured.slice().reverse().slice(0, 4).map(product => (
                  <ProductCard key={`best-${product._id}`} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* ── PROMO BANNER 2 ──────────────── */}
          <div className="mp-promo-banner">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&h=200&auto=format&fit=crop" alt="Promo Banner 2" className="mp-promo-img" style={{ height: '200px', objectFit: 'cover' }} />
          </div>

          {/* ── TRENDING PRODUCTS ──────────────── */}
          {featured.length > 2 && (
            <div className="mp-section">
              <div className="mp-section-header">
                <h2 className="mp-section-title">Trending Products</h2>
              </div>
              <div className="mp-product-grid">
                {featured.slice(1, 5).map(product => (
                  <ProductCard key={`trend-${product._id}`} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* ── TESTIMONIALS ──────────────── */}
          <div className="mp-section" style={{ background: '#f8f9fa' }}>
            <div className="mp-section-header">
              <h2 className="mp-section-title" style={{ textAlign: 'center', width: '100%', display: 'block' }}>What Our Customers Say</h2>
            </div>
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3000 }}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              style={{ paddingBottom: '40px' }}
            >
              {testimonials.map(item => (
                <SwiperSlide key={item.id}>
                  <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <img src={item.img} alt={item.name} style={{ width: '60px', height: '60px', borderRadius: '50%', marginBottom: '15px' }} />
                    <h4 style={{ margin: '0 0 5px', fontSize: '16px' }}>{item.name}</h4>
                    <div style={{ color: '#ffb400', marginBottom: '10px' }}>
                      {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                    </div>
                    <p style={{ fontSize: '14px', color: '#555', fontStyle: 'italic', margin: 0 }}>"{item.review}"</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ── NEWSLETTER SECTION ──────────────── */}
          <div style={{ background: 'var(--mp-primary)', padding: '60px 20px', textAlign: 'center', color: '#fff', marginTop: '20px', borderRadius: '4px' }}>
            <h2 style={{ margin: '0 0 10px', fontSize: '28px' }}>Join Our Newsletter</h2>
            <p style={{ margin: '0 0 20px', fontSize: '16px', opacity: 0.9 }}>Get updates on the latest trends and exclusive offers.</p>
            <div style={{ display: 'flex', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}>
              <input type="email" placeholder="Enter your email address" style={{ flex: 1, padding: '12px 20px', border: 'none', borderRadius: '4px 0 0 4px', outline: 'none' }} />
              <button style={{ padding: '12px 30px', background: 'var(--mp-secondary)', color: '#212121', border: 'none', borderRadius: '0 4px 4px 0', fontWeight: 'bold', cursor: 'pointer' }}>SUBSCRIBE</button>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default Home;
