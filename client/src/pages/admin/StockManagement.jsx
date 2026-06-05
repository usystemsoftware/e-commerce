import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getStockReportAPI, updateStockAPI } from '../../services/api';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(10);
  const [editStock, setEditStock] = useState({});
  const [updating, setUpdating] = useState(null);

  const fetchStock = () => {
    setLoading(true);
    getStockReportAPI(threshold).then(r => {
      setProducts(r.data);
      const initial = {};
      r.data.forEach(p => { initial[p._id] = p.stock; });
      setEditStock(initial);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStock(); }, [threshold]);

  const handleStockUpdate = async (productId, name) => {
    const newStock = Number(editStock[productId]);
    if (isNaN(newStock) || newStock < 0) { toast.error('Invalid stock value'); return; }
    setUpdating(productId);
    try {
      await updateStockAPI(productId, newStock);
      toast.success(`Stock updated for ${name}`);
      setProducts(prev => prev.map(p => p._id === productId ? { ...p, stock: newStock } : p));
    } catch { toast.error('Failed to update stock'); } finally { setUpdating(null); }
  };

  const outOfStock = products.filter(p => p.stock === 0).length;
  const criticalStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 style={{ fontWeight: 800, margin: 0 }}>Stock Management</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>Monitor and update product inventory</p>
        </div>
      </div>

      {/* Alert cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--danger)' }}>
              <i className="bi bi-x-circle"></i>
            </div>
            <div>
              <div className="stat-label">Out of Stock</div>
              <div className="stat-value" style={{ color: 'var(--danger)', fontSize: '1.8rem' }}>{outOfStock}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' }}>
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <div>
              <div className="stat-label">Critical (≤5)</div>
              <div className="stat-value" style={{ color: 'var(--warning)', fontSize: '1.8rem' }}>{criticalStock}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(108,62,244,0.15)', color: 'var(--primary-light)' }}>
              <i className="bi bi-box-seam"></i>
            </div>
            <div>
              <div className="stat-label">Low Stock Products</div>
              <div className="stat-value" style={{ fontSize: '1.8rem' }}>{products.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Threshold filter */}
      <div className="card-custom" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>Show products with stock ≤</span>
        <div className="d-flex gap-2">
          {[5, 10, 20, 50].map(t => (
            <button key={t} onClick={() => setThreshold(t)} style={{
              padding: '6px 16px', borderRadius: '50px',
              background: threshold === t ? 'var(--primary)' : 'var(--dark-3)',
              border: `1px solid ${threshold === t ? 'var(--primary)' : 'var(--border)'}`,
              color: threshold === t ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600, fontSize: '13px',
            }}>{t}</button>
          ))}
        </div>
        <button onClick={fetchStock} style={{ background: 'rgba(108,62,244,0.1)', border: '1px solid var(--primary)', color: 'var(--primary-light)', padding: '6px 14px', borderRadius: '50px', cursor: 'pointer', fontFamily: 'Outfit', fontSize: '13px', fontWeight: 600 }}>
          <i className="bi bi-arrow-clockwise me-1"></i>Refresh
        </button>
      </div>

      <div className="card-custom" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="p-4"><Spinner /></div> : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--success)' }}>
            <i className="bi bi-check-circle-fill" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}></i>
            <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>All Good!</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No products below the stock threshold</div>
          </div>
        ) : (
          <table className="table-custom">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Alert Level</th>
                <th>Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={p.images?.[0] || `https://picsum.photos/seed/${p._id}/60/60`}
                        style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        alt=""
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{p.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>₹{p.price?.toLocaleString()}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px' }}>{p.category?.name || '—'}</td>
                  <td>
                    <span style={{
                      fontWeight: 800, fontSize: '18px',
                      color: p.stock === 0 ? 'var(--danger)' : p.stock <= 5 ? 'var(--warning)' : 'var(--text-primary)'
                    }}>{p.stock}</span>
                  </td>
                  <td>
                    {p.stock === 0
                      ? <span className="badge-danger">Out of Stock</span>
                      : p.stock <= 5
                        ? <span className="badge-warning">Critical</span>
                        : <span className="badge-primary">Low</span>
                    }
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={editStock[p._id] ?? p.stock}
                        onChange={e => setEditStock(s => ({ ...s, [p._id]: e.target.value }))}
                        className="form-control-custom"
                        style={{ width: '90px', padding: '6px 12px', fontSize: '14px' }}
                      />
                      <button
                        onClick={() => handleStockUpdate(p._id, p.name)}
                        disabled={updating === p._id}
                        className="btn-primary-custom"
                        style={{ padding: '7px 14px', fontSize: '13px' }}
                      >
                        {updating === p._id ? '...' : <><i className="bi bi-check2"></i> Save</>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default StockManagement;
