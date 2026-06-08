import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginAPI(form);
      login(data);
      toast.success(`Welcome back, ${data.name}! 👋`);
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-hero)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800 }} className="gradient-text"><i className="bi bi-bag-heart-fill me-2"></i>ShopZone</div>
          </Link>
          <h2 style={{ fontWeight: 700, marginTop: '16px', marginBottom: '6px' }}>Welcome Back!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Sign in to your account</p>
        </div>

        <div className="card-custom" style={{ padding: '36px' }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-envelope" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                <input
                  className="form-control-custom"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-lock" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                <input
                  className="form-control-custom"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ paddingLeft: '40px', paddingRight: '44px' }}
                  required
                />
                <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}>
                  <i className={`bi bi-eye${showPw ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary-custom w-100 justify-content-center" style={{ padding: '14px', fontSize: '15px' }} disabled={loading}>
              {loading ? 'Signing in...' : <><i className="bi bi-box-arrow-in-right"></i> Sign In</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Register</Link>
          </div>
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Test: user@shop.com / user123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
