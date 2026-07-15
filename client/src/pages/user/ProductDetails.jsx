import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductByIdAPI, addReviewAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const wishlisted = isWishlisted(id);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getProductByIdAPI(id);
        setProduct(data);
      } catch { navigate('/products'); }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => addToCart(product._id, qty);

  const handleBuyNow = () => {
    addToCart(product._id, qty);
    navigate('/cart');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    try {
      setSubmitting(true);
      await addReviewAPI(id, reviewForm);
      toast.success('Review submitted!');
      const { data } = await getProductByIdAPI(id);
      setProduct(data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const renderStars = (rating) => (
    [...Array(5)].map((_, i) => (
      <i key={i} className={`bi bi-star${i < Math.floor(rating) ? '-fill' : rating % 1 >= 0.5 && i === Math.floor(rating) ? '-half' : ''}`}
        style={{ color: '#fbbf24' }}></i>
    ))
  );

  if (loading) return <Spinner />;
  if (!product) return null;

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discount = product.discountPercent;

  return (
    <div>
      <div className="container py-5">
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => navigate('/')}>Home</span>
          <span className="mx-2">/</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => navigate('/products')}>Products</span>
          <span className="mx-2">/</span>
          <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
        </nav>

        <div className="row g-5">
          {/* Images */}
          <div className="col-lg-5">
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '12px' }}>
              <img
                src={product.images?.[selectedImg] || `https://picsum.photos/seed/${product._id}/600/500`}
                alt={product.name}
                style={{ width: '100%', height: '420px', objectFit: 'cover' }}
              />
            </div>
            <div className="d-flex gap-2">
              {(product.images?.length > 0 ? product.images : [`https://picsum.photos/seed/${product._id}/600/500`]).map((img, i) => (
                <div key={i} onClick={() => setSelectedImg(i)} style={{ width: '72px', height: '72px', border: `2px solid ${selectedImg === i ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer', flexShrink: 0 }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="col-lg-7">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge-primary">{product.category?.name}</span>
              {product.isFeatured && <span className="badge-secondary">Featured</span>}
              {product.stock === 0 && <span className="badge-danger">Out of Stock</span>}
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>{product.name}</h1>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>Brand: <strong style={{ color: 'var(--primary-light)' }}>{product.brand}</strong></div>

            {/* Rating */}
            <div className="d-flex align-items-center gap-3 mb-20" style={{ marginBottom: '20px' }}>
              <div className="d-flex gap-1">{renderStars(product.ratings)}</div>
              <span style={{ fontWeight: 600 }}>{product.ratings?.toFixed(1)}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <span style={{ fontSize: '2.2rem', fontWeight: 800 }}>₹{price.toLocaleString()}</span>
              {product.discountPrice > 0 && (
                <>
                  <span style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '1.2rem' }}>₹{product.price.toLocaleString()}</span>
                  <span className="badge-success">{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="mb-4" style={{ fontSize: '14px' }}>
              Stock: <strong style={{ color: product.stock > 10 ? 'var(--success)' : product.stock > 0 ? 'var(--warning)' : 'var(--danger)' }}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
              </strong>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="d-flex align-items-center gap-3 mb-4">
                <span style={{ fontWeight: 600 }}>Qty:</span>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-display">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="d-flex gap-3 flex-wrap mb-4">
              <button className="btn-primary-custom" style={{ flex: 1, minWidth: '160px', padding: '14px', justifyContent: 'center', fontSize: '15px' }} onClick={handleAddToCart} disabled={product.stock === 0}>
                <i className="bi bi-bag-plus"></i> Add to Cart
              </button>
              <button className="btn-outline-custom" style={{ flex: 1, minWidth: '160px', padding: '14px', justifyContent: 'center', fontSize: '15px' }} onClick={handleBuyNow} disabled={product.stock === 0}>
                <i className="bi bi-lightning"></i> Buy Now
              </button>
              <button
                onClick={() => wishlisted ? removeFromWishlist(product._id) : addToWishlist(product._id)}
                style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'var(--card-bg)', border: `1px solid ${wishlisted ? 'var(--danger)' : 'var(--border)'}`, color: wishlisted ? 'var(--danger)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', transition: 'all 0.2s' }}
              >
                <i className={`bi bi-heart${wishlisted ? '-fill' : ''}`}></i>
              </button>
            </div>

            {/* Delivery info */}
            <div className="d-flex gap-4 flex-wrap" style={{ padding: '16px', background: 'var(--dark-3)', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
              {[['bi-truck', 'Free delivery on orders over ₹499'], ['bi-shield-check', 'Secure payment'], ['bi-arrow-repeat', '30-day returns']].map(([icon, text]) => (
                <span key={text} className="d-flex align-items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <i className={`bi ${icon}`} style={{ color: 'var(--success)' }}></i> {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5">
          <div className="d-flex gap-2 mb-4 flex-wrap" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            {['description', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background: activeTab === tab ? 'rgba(108,62,244,0.15)' : 'transparent',
                border: `1px solid ${activeTab === tab ? 'var(--primary)' : 'var(--border)'}`,
                color: activeTab === tab ? 'var(--primary-light)' : 'var(--text-muted)',
                padding: '8px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: 600, fontFamily: 'Outfit', fontSize: '14px'
              }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'reviews' && `(${product.numReviews})`}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '15px' }}>
              <p>{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="mt-3 d-flex gap-2 flex-wrap">
                  {product.tags.map(t => <span key={t} className="badge-primary">{t}</span>)}
                </div>
              )}
            </div>
          ) : (
            <div>
              {product.reviews?.map(r => (
                <div key={r._id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '12px' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      <strong>{r.name}</strong>
                      <div className="d-flex gap-1 mt-1">{renderStars(r.rating)}</div>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '14px' }}>{r.comment}</p>
                </div>
              ))}
              {user && (
                <form onSubmit={handleReview} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', marginTop: '20px' }}>
                  <h5 style={{ fontWeight: 700, marginBottom: '16px' }}>Write a Review</h5>
                  <div className="mb-3">
                    <label style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px', display: 'block' }}>Rating</label>
                    <select className="form-control-custom" value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '8px', display: 'block' }}>Comment</label>
                    <textarea className="form-control-custom" rows="3" placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} required></textarea>
                  </div>
                  <button type="submit" className="btn-primary-custom" disabled={submitting}>
                    {submitting ? 'Submitting...' : <><i className="bi bi-send"></i> Submit Review</>}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
