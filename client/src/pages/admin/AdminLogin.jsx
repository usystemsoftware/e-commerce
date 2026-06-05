import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLoginAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await adminLoginAPI(form);
      login(data);
      toast.success('Admin access granted!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid admin credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-hero)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>
            <i className="bi bi-shield-lock-fill text-white"></i>
          </div>
          <h2 style={{ fontWeight: 800 }}>Admin Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>ShopZone Admin Dashboard</p>
        </div>
        <div className="card-custom" style={{ padding: '36px' }}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Admin Email</label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-envelope" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                <input className="form-control-custom" type="email" placeholder="admin@shop.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ paddingLeft: '40px' }} required />
              </div>
            </div>
            <div className="mb-4">
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <i className="bi bi-lock" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
                <input className="form-control-custom" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ paddingLeft: '40px' }} required />
              </div>
            </div>
            <button type="submit" className="btn-primary-custom w-100 justify-content-center" style={{ padding: '14px' }} disabled={loading}>
              {loading ? 'Signing in...' : <><i className="bi bi-shield-check"></i> Admin Login</>}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>admin@shop.com / admin123</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
