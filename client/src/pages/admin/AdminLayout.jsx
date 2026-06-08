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
  { path: '/admin/settings', icon: 'bi-gear', label: 'Settings' },
  { path: '/admin/banners', icon: 'bi-images', label: 'Banners' },
  { path: '/admin/coupons', icon: 'bi-ticket-perforated', label: 'Coupons' },
  { path: '/admin/pages', icon: 'bi-file-earmark-text', label: 'Pages' },
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
    <div className="admin-theme">
      <div className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="gradient-text"><i className="bi bi-shield-lock-fill me-2"></i>ShopZone</span>
          <div style={{ fontSize: '11px', color: 'var(--admin-text-muted)', fontWeight: 500, marginTop: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>Admin Panel</div>
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
        <div style={{ position: 'absolute', bottom: 0, width: '100%', borderTop: '1px solid var(--admin-border)', padding: '16px 20px', backdropFilter: 'var(--admin-glass-blur)' }}>
          <div style={{ fontSize: '12px', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>Logged in as</div>
          <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '10px', color: 'var(--admin-text)' }}>{user?.name || 'Administrator'}</div>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--danger)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'Calibri', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', width: '100%', transition: 'all 0.3s' }} className="logout-btn">
            <i className="bi bi-box-arrow-left"></i> Logout
          </button>
        </div>
      </div>
      <div className="admin-content">
        <div className="container-fluid p-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
