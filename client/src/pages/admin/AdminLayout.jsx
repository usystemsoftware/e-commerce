import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const navItems = [
  { path: '/admin/dashboard', icon: 'bi-grid', label: 'Dashboard' },
  { path: '/admin/products', icon: 'bi-box-seam', label: 'Products' },
  { path: '/admin/categories', icon: 'bi-tag', label: 'Categories' },
  { path: '/admin/orders', icon: 'bi-receipt', label: 'Orders' },
  { path: '/admin/users', icon: 'bi-people', label: 'Users' },
  { path: '/admin/stock', icon: 'bi-bar-chart', label: 'Stock' },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="gradient-text"><i className="bi bi-shield-lock-fill me-2"></i>ShopZone</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400, marginTop: '4px' }}>Admin Panel</div>
        </div>
        <div style={{ padding: '20px 0' }}>
          {navItems.map(item => (
            <div key={item.path} className="nav-item">
              <Link to={item.path} className={location.pathname === item.path ? 'active' : ''}>
                <i className={`bi ${item.icon}`}></i> {item.label}
              </Link>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', borderTop: '1px solid var(--border)', padding: '16px 20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Logged in as</div>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '10px' }}>{user?.name}</div>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--danger)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'Outfit', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            <i className="bi bi-box-arrow-left"></i> Logout
          </button>
        </div>
      </div>
      <div className="admin-content">{children}</div>
    </div>
  );
};

export default AdminLayout;
