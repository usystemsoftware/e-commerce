import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { placeOrderAPI, validateCouponAPI, createRazorpayOrderAPI, verifyRazorpayPaymentAPI } from '../../services/api';
import { toast } from 'react-toastify';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const steps = ['Address', 'Payment', 'Confirm'];

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ fullName: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [useSuperCoins, setUseSuperCoins] = useState(false);

  const items = cart.items || [];
  const subtotal = items.reduce((a, i) => a + i.price * i.quantity, 0);
  
  // Recalculate based on discount
  let calculatedDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      calculatedDiscount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      calculatedDiscount = appliedCoupon.discountValue;
    }
  }

  const shipping = subtotal > 499 ? 0 : 49;
  const tax = parseFloat((0.05 * (subtotal - calculatedDiscount)).toFixed(2));
  const preCoinsTotal = subtotal - calculatedDiscount + shipping + tax;
  const maxCoinsUsable = Math.min(user?.superCoins || 0, Math.floor(preCoinsTotal));
  const coinsDiscount = useSuperCoins ? maxCoinsUsable : 0;
  const total = preCoinsTotal - coinsDiscount;

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    try {
      const { data } = await validateCouponAPI({ code: couponCodeInput });
      setAppliedCoupon(data);
      setDiscount(calculatedDiscount);
      toast.success('Coupon applied!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    }
  };

  const handleAddressSubmit = (e) => { e.preventDefault(); setStep(1); };
  const handlePaymentSubmit = (e) => { e.preventDefault(); setStep(2); };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const { data: order } = await placeOrderAPI({ 
        shippingAddress: address, 
        paymentMethod: paymentMethod === 'Card' || paymentMethod === 'UPI' ? 'Card' : paymentMethod,
        couponCode: appliedCoupon?.code,
        superCoinsToUse: coinsDiscount
      });

      if (paymentMethod === 'Card' || paymentMethod === 'UPI') {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!res) {
          toast.error('Razorpay SDK failed to load. Are you online?');
          setPlacing(false);
          return;
        }

        const { data: rzOrder } = await createRazorpayOrderAPI({ orderId: order._id });

        const options = {
          key: rzOrder.key,
          amount: rzOrder.amount,
          currency: rzOrder.currency,
          name: 'Your E-commerce',
          description: 'Order Payment',
          order_id: rzOrder.id,
          handler: async function (response) {
            try {
              await verifyRazorpayPaymentAPI({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              });
              await clearCart();
              toast.success('Payment successful & Order placed! 🎉');
              navigate(`/orders/${order._id}`);
            } catch (err) {
              toast.error('Payment verification failed');
              navigate(`/orders/${order._id}`);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: address.phone,
          },
          theme: { color: '#6C3EF4' },
          modal: {
            ondismiss: function() {
              toast.warning('Payment cancelled. You can retry from your orders page.');
              setPlacing(false);
              navigate(`/orders/${order._id}`);
            }
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        await clearCart();
        toast.success('Order placed successfully! 🎉');
        navigate(`/orders/${order._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setPlacing(false);
    }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
        </div>
      </div>
      <div className="container pb-5">
        {/* Steps */}
        <div className="checkout-steps mb-5">
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div className={`checkout-step ${step === i ? 'active' : step > i ? 'done' : ''}`}>
                <div className="checkout-step-num">
                  {step > i ? <i className="bi bi-check-lg"></i> : i + 1}
                </div>
                <span className="checkout-step-label">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`checkout-connector ${step > i ? 'done' : ''}`}></div>}
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-lg-7">
            {/* Step 0: Address */}
            {step === 0 && (
              <div className="card-custom">
                <h5 style={{ fontWeight: 700, marginBottom: '24px' }}><i className="bi bi-geo-alt me-2"></i>Delivery Address</h5>
                <form onSubmit={handleAddressSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Full Name *</label>
                      <input className="form-control-custom" value={address.fullName} onChange={e => setAddress(a => ({ ...a, fullName: e.target.value }))} required />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Phone *</label>
                      <input className="form-control-custom" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} required />
                    </div>
                    <div className="col-12">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Street Address *</label>
                      <input className="form-control-custom" value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} required />
                    </div>
                    <div className="col-md-4">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>City *</label>
                      <input className="form-control-custom" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} required />
                    </div>
                    <div className="col-md-4">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>State *</label>
                      <input className="form-control-custom" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} required />
                    </div>
                    <div className="col-md-4">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Pincode *</label>
                      <input className="form-control-custom" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} required />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary-custom mt-4" style={{ padding: '12px 32px' }}>
                    Continue to Payment <i className="bi bi-arrow-right"></i>
                  </button>
                </form>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="card-custom">
                <h5 style={{ fontWeight: 700, marginBottom: '24px' }}><i className="bi bi-credit-card me-2"></i>Payment Method</h5>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="d-flex flex-column gap-3 mb-4">
                    {[['COD', 'bi-cash-coin', 'Cash on Delivery', 'Pay when your order arrives'], ['Card', 'bi-credit-card', 'Credit / Debit Card', 'Visa, Mastercard, RuPay'], ['UPI', 'bi-phone', 'UPI Payment', 'GPay, PhonePe, BHIM UPI']].map(([val, icon, label, sub]) => (
                      <div key={val} onClick={() => setPaymentMethod(val)} style={{ background: paymentMethod === val ? 'rgba(108,62,244,0.1)' : 'var(--dark-3)', border: `1px solid ${paymentMethod === val ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: paymentMethod === val ? 'rgba(108,62,244,0.2)' : 'var(--dark-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: paymentMethod === val ? 'var(--primary-light)' : 'var(--text-muted)' }}>
                          <i className={`bi ${icon}`}></i>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{label}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{sub}</div>
                        </div>
                        {paymentMethod === val && <i className="bi bi-check-circle-fill ms-auto" style={{ color: 'var(--primary)', fontSize: '20px' }}></i>}
                      </div>
                    ))}
                  </div>
                  {/* Card input dummy UI removed since Razorpay handles it */}
                  {paymentMethod === 'Card' && (
                    <div className="mb-4">
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        You will be redirected to Razorpay securely to enter your card details.
                      </div>
                    </div>
                  )}
                  {paymentMethod === 'UPI' && (
                    <div className="mb-4">
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        You will be redirected to Razorpay securely to complete your UPI payment.
                      </div>
                    </div>
                  )}
                  <div className="d-flex gap-3">
                    <button type="button" className="btn-outline-custom" onClick={() => setStep(0)}>
                      <i className="bi bi-arrow-left"></i> Back
                    </button>
                    <button type="submit" className="btn-primary-custom">
                      Review Order <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div className="card-custom">
                <h5 style={{ fontWeight: 700, marginBottom: '24px' }}><i className="bi bi-check-circle me-2"></i>Order Confirmation</h5>
                <div style={{ marginBottom: '20px', padding: '16px', background: 'var(--dark-3)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Delivery to:</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {address.fullName} • {address.phone}<br />
                    {address.street}, {address.city}, {address.state} - {address.pincode}
                  </div>
                </div>
                <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--dark-3)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>Payment:</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {paymentMethod === 'COD' ? '💵 Cash on Delivery' : paymentMethod === 'Card' ? '💳 Card Payment' : '📱 UPI Payment'}
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <button className="btn-outline-custom" onClick={() => setStep(1)}><i className="bi bi-arrow-left"></i> Back</button>
                  <button className="btn-primary-custom" onClick={handlePlaceOrder} disabled={placing} style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
                    {placing ? 'Placing Order...' : <><i className="bi bi-bag-check"></i> Place Order — ₹{total.toLocaleString()}</>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="col-lg-5">
            <div className="card-custom" style={{ position: 'sticky', top: '80px' }}>
              <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>Order Summary</h5>
              <div className="d-flex flex-column gap-3 mb-4" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {items.map(item => (
                  <div key={item.product._id} className="d-flex align-items-center gap-3">
                    <img src={item.product.images?.[0] || `https://picsum.photos/seed/${item.product._id}/100/100`} style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} alt="" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{item.product.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div className="d-flex justify-content-between mb-3">
                  <div className="input-group">
                    <input type="text" className="form-control-custom" placeholder="Coupon code" value={couponCodeInput} onChange={e => setCouponCodeInput(e.target.value)} disabled={!!appliedCoupon} style={{ borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }} />
                    <button className="btn btn-outline-secondary" onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCodeInput(''); } : handleApplyCoupon} style={{ borderColor: 'var(--border)', color: appliedCoupon ? 'var(--danger)' : 'var(--text-primary)', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                      {appliedCoupon ? 'Remove' : 'Apply'}
                    </button>
                  </div>
                </div>
                {appliedCoupon && (
                  <div className="d-flex justify-content-between mb-2" style={{ fontSize: '14px', color: 'var(--success)' }}>
                    <span>Discount ({appliedCoupon.code})</span><span>-₹{calculatedDiscount.toLocaleString()}</span>
                  </div>
                )}
                {user?.superCoins > 0 && (
                  <div className="mb-3" style={{ padding: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-sm)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0, fontSize: '14px', color: 'var(--text-primary)' }}>
                      <input type="checkbox" checked={useSuperCoins} onChange={e => setUseSuperCoins(e.target.checked)} />
                      <span>Use SuperCoins (Balance: <strong style={{ color: 'var(--warning)' }}>{user.superCoins}</strong>)</span>
                    </label>
                  </div>
                )}
                {[['Subtotal', `₹${subtotal.toLocaleString()}`], ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`], ['Tax (5%)', `₹${tax}`]].map(([l, v]) => (
                  <div key={l} className="d-flex justify-content-between mb-2" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <span>{l}</span><span>{v}</span>
                  </div>
                ))}
                {useSuperCoins && coinsDiscount > 0 && (
                  <div className="d-flex justify-content-between mb-2" style={{ fontSize: '14px', color: 'var(--warning)', fontWeight: 600 }}>
                    <span>SuperCoins Used</span><span>-₹{coinsDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mt-3" style={{ fontWeight: 800, fontSize: '18px' }}>
                  <span>Total</span><span className="gradient-text">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
