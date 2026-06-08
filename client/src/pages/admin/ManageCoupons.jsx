import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getAllCouponsAPI, createCouponAPI, updateCouponAPI, deleteCouponAPI } from '../../services/api';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';

const emptyForm = { code: '', discountType: 'percentage', discountValue: '', expiryDate: '', usageLimit: '', isActive: true };

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = () => {
    getAllCouponsAPI().then(r => setCoupons(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const openEdit = (coupon) => {
    setEditId(coupon._id);
    setForm({ 
      code: coupon.code, 
      discountType: coupon.discountType, 
      discountValue: coupon.discountValue, 
      expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0], 
      usageLimit: coupon.usageLimit || '', 
      isActive: coupon.isActive 
    });
    setShowForm(true);
  };

  const resetForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form, usageLimit: form.usageLimit ? Number(form.usageLimit) : null };
      
      if (editId) {
        await updateCouponAPI(editId, data);
        toast.success('Coupon updated');
      } else {
        await createCouponAPI(data);
        toast.success('Coupon created');
      }
      resetForm();
      fetchCoupons();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await deleteCouponAPI(id);
      toast.success('Coupon deleted');
      setCoupons(prev => prev.filter(c => c._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontWeight: 800, margin: 0 }}>Coupons</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>{coupons.length} active coupons</p>
        </div>
        <button className="btn-primary-custom" onClick={() => { resetForm(); setShowForm(true); }}>
          <i className="bi bi-plus-lg"></i> Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="card-custom mb-4">
          <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>{editId ? 'Edit Coupon' : 'New Coupon'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Coupon Code *</label>
                <input className="form-control-custom" style={{ textTransform: 'uppercase' }} value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} required placeholder="e.g. SUMMER50" />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Discount Type</label>
                <select className="form-control-custom" value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Discount Value *</label>
                <input type="number" className="form-control-custom" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} required min="1" />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Expiry Date *</label>
                <input type="date" className="form-control-custom" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} required />
              </div>
              <div className="col-md-4">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Usage Limit</label>
                <input type="number" className="form-control-custom" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} placeholder="Leave blank for unlimited" min="1" />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ width: '40px', height: '20px' }} />
                  <label className="form-check-label ms-2" style={{ fontWeight: 600 }}>Active Status</label>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn-primary-custom" disabled={saving}>
                {saving ? 'Saving...' : <><i className="bi bi-check2"></i> {editId ? 'Update' : 'Create'} Coupon</>}
              </button>
              <button type="button" className="btn-outline-custom" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card-custom" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="p-4"><Spinner /></div> : (
          <table className="table-custom">
            <thead><tr><th>Code</th><th>Discount</th><th>Usage</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon._id}>
                  <td>
                    <code style={{ fontSize: '14px', background: 'var(--admin-bg)', padding: '4px 8px', borderRadius: '4px', color: 'var(--primary)' }}>
                      <i className="bi bi-ticket-perforated me-2"></i>{coupon.code}
                    </code>
                  </td>
                  <td style={{ fontWeight: 600 }}>{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</td>
                  <td>{coupon.usedCount} / {coupon.usageLimit || '∞'}</td>
                  <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                  <td><span className={coupon.isActive && new Date(coupon.expiryDate) > new Date() ? 'badge-success' : 'badge-danger'}>
                    {coupon.isActive ? (new Date(coupon.expiryDate) > new Date() ? 'Active' : 'Expired') : 'Disabled'}
                  </span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <button onClick={() => openEdit(coupon)} style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(108,62,244,0.15)', border: '1px solid var(--primary)', color: 'var(--primary-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button onClick={() => handleDelete(coupon._id, coupon.code)} style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
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

export default ManageCoupons;
