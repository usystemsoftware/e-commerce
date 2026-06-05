import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const items = cart.items || [];
  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  if (items.length === 0) return (
    <div className="container py-5">
      <div className="empty-state">
        <i className="bi bi-bag-x"></i>
        <h3>Your Cart is Empty</h3>
        <p>Add some products to get started!</p>
        <Link to="/products" className="btn-primary-custom">Shop Now <i className="bi bi-arrow-right"></i></Link>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-bag me-2"></i>Shopping Cart</h1>
          <p>{items.length} item(s) in your cart</p>
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
              {items.map(item => (
                <div key={item.product._id} className="cart-item">
                  <img src={item.product.images?.[0] || `https://picsum.photos/seed/${item.product._id}/150/150`} alt={item.product.name} />
                  <div style={{ flex: 1 }}>
                    <Link to={`/products/${item.product._id}`} style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '15px', textDecoration: 'none', display: 'block', marginBottom: '4px' }}>{item.product.name}</Link>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Unit price: ₹{item.price.toLocaleString()}</div>
                  </div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.product._id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                    <span className="qty-display">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.product._id, item.quantity + 1)} disabled={item.quantity >= item.product.stock}>+</button>
                  </div>
                  <div style={{ minWidth: '100px', textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                    <button onClick={() => removeFromCart(item.product._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '13px', cursor: 'pointer', marginTop: '4px' }}>
                      <i className="bi bi-trash3"></i> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Link to="/products" style={{ color: 'var(--primary-light)', fontSize: '14px' }}><i className="bi bi-arrow-left me-1"></i>Continue Shopping</Link>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card-custom" style={{ position: 'sticky', top: '80px' }}>
              <h5 style={{ fontWeight: 700, marginBottom: '24px' }}>Order Summary</h5>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span>Subtotal ({items.length} items)</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="d-flex justify-content-between mb-3" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span>Tax (5%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              {subtotal < 499 && <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '13px', color: 'var(--secondary)', marginBottom: '16px' }}>Add ₹{(499 - subtotal).toFixed(0)} more for free shipping!</div>}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '20px' }}>
                <div className="d-flex justify-content-between" style={{ fontWeight: 700, fontSize: '18px' }}>
                  <span>Total</span>
                  <span className="gradient-text">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout')} className="btn-primary-custom w-100 justify-content-center" style={{ padding: '14px', fontSize: '15px' }}>
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
