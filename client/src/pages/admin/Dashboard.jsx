import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getDashboardStatsAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Spinner from '../../components/Spinner/Spinner';
import { Link } from 'react-router-dom';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STATUS_COLORS = { pending: '#f59e0b', processing: '#6c3ef4', shipped: '#06b6d4', delivered: '#10b981', cancelled: '#ef4444' };

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStatsAPI().then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><Spinner /></AdminLayout>;

  const chartData = stats.monthlyRevenue?.map(d => ({
    month: MONTHS[d._id.month - 1],
    revenue: Math.round(d.revenue),
    orders: d.orders,
  }));

  const pieData = stats.ordersByStatus?.map(s => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
    value: s.count,
    color: STATUS_COLORS[s._id] || '#6b6990',
  }));

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontWeight: 800, margin: 0 }}>Dashboard</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>Welcome back! Here's what's happening.</p>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          <i className="bi bi-calendar3 me-1"></i> {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Stat cards */}
      <div className="row g-4 mb-4">
        {[
          { icon: 'bi-currency-rupee', label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, color: 'purple' },
          { icon: 'bi-receipt', label: 'Total Orders', value: stats.totalOrders, color: 'orange' },
          { icon: 'bi-people', label: 'Total Users', value: stats.totalUsers, color: 'cyan' },
          { icon: 'bi-box-seam', label: 'Active Products', value: stats.totalProducts, color: 'green' },
        ].map(({ icon, label, value, color }) => (
          <div key={label} className="col-6 col-xl-3">
            <div className="stat-card">
              <div className={`stat-icon ${color}`}><i className={`bi ${icon}`}></i></div>
              <div>
                <div className="stat-label">{label}</div>
                <div className="stat-value gradient-text">{value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card-custom" style={{ padding: '24px' }}>
            <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>Revenue & Orders (Last 6 Months)</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--dark-2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Bar dataKey="revenue" fill="#6c3ef4" radius={[4, 4, 0, 0]} name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card-custom" style={{ padding: '24px' }}>
            <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>Orders by Status</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {pieData?.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--dark-2)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Legend formatter={v => <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card-custom" style={{ padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: 700, margin: 0 }}>Recent Orders</h5>
              <Link to="/admin/orders" style={{ fontSize: '13px', color: 'var(--primary-light)' }}>View All</Link>
            </div>
            <table className="table-custom w-100">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {stats.recentOrders?.map(o => (
                  <tr key={o._id}>
                    <td style={{ fontWeight: 600, fontSize: '13px' }}>#{o._id.slice(-6).toUpperCase()}</td>
                    <td>{o.user?.name}</td>
                    <td>₹{o.totalAmount?.toLocaleString()}</td>
                    <td><span className={`badge-${STATUS_COLORS[o.orderStatus] ? o.orderStatus === 'delivered' ? 'success' : o.orderStatus === 'cancelled' ? 'danger' : 'warning' : 'primary'}`} style={{ textTransform: 'capitalize' }}>{o.orderStatus}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card-custom" style={{ padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: 700, margin: 0 }}>Low Stock Alert</h5>
              <Link to="/admin/stock" style={{ fontSize: '13px', color: 'var(--primary-light)' }}>Manage</Link>
            </div>
            {stats.lowStockProducts?.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--success)', padding: '20px 0', fontSize: '14px' }}>
                <i className="bi bi-check-circle-fill me-2"></i>All products in stock!
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {stats.lowStockProducts?.map(p => (
                  <div key={p._id} className="d-flex align-items-center gap-3">
                    <img src={p.images?.[0] || `https://picsum.photos/seed/${p._id}/60/60`} style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} alt="" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: '12px', color: p.stock === 0 ? 'var(--danger)' : 'var(--warning)' }}>
                        {p.stock === 0 ? 'Out of Stock' : `${p.stock} left`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
