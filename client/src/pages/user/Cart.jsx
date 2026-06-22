import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { validateCouponAPI, getActiveCouponsAPI, getProductsAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, loading, appliedCoupon, setAppliedCoupon, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();
  
  const items = cart.items || [];
  // Filter out any cart items where the product has been deleted from the DB
  const validItems = items.filter(i => i.product != null);
  
  const [couponCodeInput, setCouponCodeInput] = useState(appliedCoupon ? appliedCoupon.code : '');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await getActiveCouponsAPI();
        setAvailableCoupons(data);
      } catch (err) {
        console.error('Failed to fetch coupons');
      }
    };
    
    const fetchRecommendations = async () => {
      try {
        const { data } = await getProductsAPI({ limit: 4 });
        setRecommendations(data.products || data);
      } catch (err) {
        console.error('Failed to fetch recommendations');
      }
    };
    
    fetchCoupons();
    fetchRecommendations();
  }, []);
  
  const subtotal = validItems.reduce((a, i) => a + i.price * i.quantity, 0);
  
  let calculatedDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      calculatedDiscount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      calculatedDiscount = appliedCoupon.discountValue;
    }
  }

  const shipping = subtotal > 499 ? 0 : 49;
  const tax = parseFloat((0.05 * Math.max(0, subtotal - calculatedDiscount)).toFixed(2));
  const total = Math.max(0, subtotal - calculatedDiscount) + shipping + tax;
  
  const hasOutOfStockItems = validItems.some(i => i.product.stock <= 0);

  const handleSaveForLater = (productId) => {
    addToWishlist(productId);
    removeFromCart(productId);
  };
  
  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    try {
      const { data } = await validateCouponAPI({ code: couponCodeInput });
      setAppliedCoupon(data);
      toast.success('Coupon applied!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    }
  };

  if (loading && items.length === 0) return (
    <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (validItems.length === 0) return (
    <div className="container py-5">
      <div className="empty-cart-enhanced">
        <i className="bi bi-bag-x"></i>
        <h3>Your Cart is Empty</h3>
        <p>Looks like you haven't added anything yet. Explore our top products!</p>
        <Link to="/products" className="btn-primary-custom px-4 py-2" style={{ display: 'inline-block' }}>Shop Now <i className="bi bi-arrow-right"></i></Link>
      </div>
      
      {recommendations && recommendations.length > 0 && (
        <div className="recommendations-wrapper">
          <h4 className="recommendations-title"><i className="bi bi-stars text-warning"></i> Trending Products</h4>
          <div className="mp-product-grid">
            {recommendations.slice(0, 4).map(product => (
              <Link to={`/products/${product._id}`} key={product._id} className="mp-product-card" style={{ textDecoration: 'none' }}>
                <div className="mp-product-image-container" style={{ height: '180px' }}>
                  <img src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/150/150`} alt={product.name} className="mp-product-image" style={{ height: '180px' }} />
                </div>
                <div className="mp-product-info" style={{ padding: '15px' }}>
                  <h5 className="mp-product-title" style={{ fontSize: '14px', marginBottom: '8px' }}>{product.name}</h5>
                  <div className="mp-price" style={{ fontSize: '16px' }}>₹{product.price.toLocaleString()}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-bag me-2"></i>Shopping Cart</h1>
          <p>{validItems.length} item(s) in your cart</p>
        </div>
      </div>
      <div className="container pb-5">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={{ fontWeight: 700, margin: 0 }}>Cart Items</h5>
              <button onClick={clearCart} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '13px', cursor: 'pointer' }}>
                <i className="bi bi-trash3 me-1"></i>Clear Cart
              </button>
            </div>
            <div className="d-flex flex-column gap-3">
              <AnimatePresence>
                {validItems.map(item => {
                  const isOutOfStock = item.product.stock <= 0;
                  return (
                    <motion.div 
                      key={item.product._id} 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="cart-item" 
                      style={{ 
                        background: 'var(--mp-white)', border: 'none', borderRadius: 'var(--mp-radius)', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: 'var(--mp-shadow)',
                        opacity: isOutOfStock ? 0.7 : 1
                      }}
                    >
                      <img src={item.product.images?.[0] || `https://picsum.photos/seed/${item.product._id}/150/150`} alt={item.product.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', filter: isOutOfStock ? 'grayscale(100%)' : 'none' }} />
                      <div style={{ flex: 1 }}>
                        <Link to={`/products/${item.product._id}`} style={{ fontWeight: 600, color: 'var(--mp-text)', fontSize: '15px', textDecoration: 'none', display: 'block', marginBottom: '4px' }}>{item.product.name}</Link>
                        <div style={{ fontSize: '13px', color: 'var(--mp-text-light)', marginBottom: '8px' }}>Unit price: ₹{item.price.toLocaleString()}</div>
                        {isOutOfStock && <span className="badge bg-danger" style={{ fontSize: '11px' }}>Out of Stock</span>}
                        {!isOutOfStock && item.product.stock < 5 && <span className="badge bg-warning text-dark" style={{ fontSize: '11px' }}>Only {item.product.stock} left</span>}
                      </div>
                      <div className="qty-control" style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '50px', border: '1px solid var(--mp-border)' }}>
                        <button className="qty-btn" onClick={() => updateQuantity(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1 || isOutOfStock} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', padding: '0 8px' }}>−</button>
                        <span className="qty-display" style={{ fontWeight: 600, padding: '0 8px' }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.product._id, item.quantity + 1)} disabled={item.quantity >= item.product.stock || isOutOfStock} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px', padding: '0 8px' }}>+</button>
                      </div>
                      <div style={{ minWidth: '120px', textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--mp-primary)' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                        <div className="d-flex flex-column align-items-end mt-2 gap-1">
                          <button onClick={() => handleSaveForLater(item.product._id)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '12px', cursor: 'pointer', padding: '2px' }}>
                            <i className="bi bi-heart"></i> Save for later
                          </button>
                          <button onClick={() => removeFromCart(item.product._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '12px', cursor: 'pointer', padding: '2px' }}>
                            <i className="bi bi-trash3"></i> Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            <div className="mt-4">
              <Link to="/products" style={{ color: 'var(--primary-light)', fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}><i className="bi bi-arrow-left me-1"></i>Continue Shopping</Link>
            </div>
            
            {recommendations && recommendations.length > 0 && (
              <div className="recommendations-wrapper">
                <h4 className="recommendations-title"><i className="bi bi-bag-plus"></i> You Might Also Like</h4>
                <div className="mp-product-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  {recommendations.slice(0, 3).map(product => (
                    <Link to={`/products/${product._id}`} key={product._id} className="mp-product-card" style={{ textDecoration: 'none' }}>
                      <div className="mp-product-image-container" style={{ height: '160px' }}>
                        <img src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/150/150`} alt={product.name} className="mp-product-image" style={{ height: '160px' }} />
                      </div>
                      <div className="mp-product-info" style={{ padding: '12px' }}>
                        <h5 className="mp-product-title" style={{ fontSize: '13px', marginBottom: '6px' }}>{product.name}</h5>
                        <div className="mp-price" style={{ fontSize: '15px' }}>₹{product.price.toLocaleString()}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-4">
            <div className="card-custom" style={{ position: 'sticky', top: '90px', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 'var(--mp-radius-lg)', padding: '24px', boxShadow: 'var(--mp-shadow)' }}>
              <h5 style={{ fontWeight: 700, marginBottom: '24px' }}>Order Summary</h5>
              
              <div className="input-group mb-2">
                <input type="text" className="form-control" placeholder="Promo code" value={couponCodeInput} onChange={e => setCouponCodeInput(e.target.value)} disabled={!!appliedCoupon} style={{ fontSize: '14px' }} />
                <button className={`btn btn-${appliedCoupon ? 'outline-danger' : 'dark'}`} onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCodeInput(''); } : handleApplyCoupon}>
                  {appliedCoupon ? 'Remove' : 'Apply'}
                </button>
              </div>

              {availableCoupons.length > 0 && !appliedCoupon && (
                <div className="mb-4" style={{ fontSize: '12px' }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Available Coupons:</div>
                  <div className="d-flex flex-wrap gap-2">
                    {availableCoupons.map(coupon => (
                      <span 
                        key={coupon._id} 
                        className="badge bg-light text-dark border" 
                        style={{ cursor: 'pointer', padding: '6px 10px', fontWeight: 500 }}
                        onClick={() => {
                          setCouponCodeInput(coupon.code);
                        }}
                      >
                        {coupon.code} <span style={{ color: 'var(--primary)', marginLeft: '4px' }}>
                          (-{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`})
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2 mt-4" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span>Subtotal ({validItems.length} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              
              {appliedCoupon && (
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '14px', color: 'var(--success)' }}>
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{calculatedDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="d-flex justify-content-between mb-3" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span>Tax (5%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              
              {(subtotal - calculatedDiscount) < 499 && <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '13px', color: 'var(--secondary)', marginBottom: '16px' }}>Add ₹{(499 - (subtotal - calculatedDiscount)).toFixed(0)} more for free shipping!</div>}
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '20px' }}>
                <div className="d-flex justify-content-between" style={{ fontWeight: 700, fontSize: '18px' }}>
                  <span>Total</span>
                  <span className="gradient-text">₹{total.toLocaleString()}</span>
                </div>
                {total > 0 && (
                  <div className="loyalty-badge w-100 justify-content-center mt-3">
                    <i className="bi bi-star-fill text-warning"></i>
                    Earn {Math.floor(total / 100)} Reward Points
                  </div>
                )}
              </div>
              
              {hasOutOfStockItems ? (
                <div className="alert alert-danger" style={{ fontSize: '13px', padding: '10px', marginBottom: '16px' }}>
                  <i className="bi bi-exclamation-circle me-1"></i> Please remove out of stock items to proceed.
                </div>
              ) : null}

              <button 
                onClick={() => navigate('/checkout')} 
                className="btn-primary-custom w-100 justify-content-center" 
                style={{ padding: '14px', fontSize: '15px' }}
                disabled={hasOutOfStockItems}
              >
                Proceed to Checkout <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
