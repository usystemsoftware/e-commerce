import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { adminGetProductsAPI, deleteProductAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner/Spinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = () => {
    adminGetProductsAPI().then(r => setProducts(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteProductAPI(id);
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch { toast.error('Failed to delete'); } finally { setDeleting(null); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 style={{ fontWeight: 800, margin: 0 }}>Products</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>{products.length} total products</p>
        </div>
        <Link to="/admin/products/add" className="btn-primary-custom"><i className="bi bi-plus-lg"></i> Add Product</Link>
      </div>

      <div className="card-custom" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '340px' }}>
          <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
          <input className="form-control-custom" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '38px' }} />
        </div>
      </div>

      <div className="card-custom" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="p-4"><Spinner /></div> : (
          <table className="table-custom">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img src={p.images?.[0] || `https://picsum.photos/seed/${p._id}/60/60`} style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} alt="" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{p.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.category?.name || '-'}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{(p.discountPrice > 0 ? p.discountPrice : p.price).toLocaleString()}</div>
                    {p.discountPrice > 0 && <div style={{ fontSize: '12px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{p.price.toLocaleString()}</div>}
                  </td>
                  <td>
                    <span style={{ color: p.stock === 0 ? 'var(--danger)' : p.stock <= 10 ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>
                      {p.stock === 0 ? 'Out' : p.stock}
                    </span>
                  </td>
                  <td>
                    <span className={p.isActive ? 'badge-success' : 'badge-danger'}>{p.isActive ? 'Active' : 'Hidden'}</span>
                    {p.isFeatured && <span className="badge-secondary ms-1">Featured</span>}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/admin/products/edit/${p._id}`} style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(108,62,244,0.15)', border: '1px solid var(--primary)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', textDecoration: 'none' }}>
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button onClick={() => handleDelete(p._id, p.name)} disabled={deleting === p._id} style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        <i className="bi bi-trash3"></i>
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

export default Products;
