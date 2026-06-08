import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getAllBannersAPI, createBannerAPI, updateBannerAPI, deleteBannerAPI } from '../../services/api';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';

const emptyForm = { title: '', linkUrl: '', sortOrder: 0, isActive: true };

const ManageBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchBanners = () => {
    getAllBannersAPI().then(r => setBanners(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBanners(); }, []);

  const openEdit = (banner) => {
    setEditId(banner._id);
    setForm({ title: banner.title, linkUrl: banner.linkUrl || '', sortOrder: banner.sortOrder, isActive: banner.isActive });
    setShowForm(true);
  };

  const resetForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); setImage(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      
      if (!editId && !image) {
        toast.error('Image is required for new banners');
        setSaving(false);
        return;
      }

      if (editId) {
        await updateBannerAPI(editId, fd);
        toast.success('Banner updated');
      } else {
        await createBannerAPI(fd);
        toast.success('Banner created');
      }
      resetForm();
      fetchBanners();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete banner "${title}"?`)) return;
    try {
      await deleteBannerAPI(id);
      toast.success('Banner deleted');
      setBanners(prev => prev.filter(b => b._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontWeight: 800, margin: 0 }}>Banners</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>{banners.length} banners</p>
        </div>
        <button className="btn-primary-custom" onClick={() => { resetForm(); setShowForm(true); }}>
          <i className="bi bi-plus-lg"></i> Add Banner
        </button>
      </div>

      {showForm && (
        <div className="card-custom mb-4">
          <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>{editId ? 'Edit Banner' : 'New Banner'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Title *</label>
                <input className="form-control-custom" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Banner Image {editId ? '' : '*'}</label>
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="form-control-custom" style={{ padding: '10px 14px' }} required={!editId} />
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Target Link URL</label>
                <input className="form-control-custom" value={form.linkUrl} onChange={e => setForm(f => ({ ...f, linkUrl: e.target.value }))} placeholder="/products?category=fashion" />
              </div>
              <div className="col-md-3">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Sort Order</label>
                <input type="number" className="form-control-custom" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} />
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ width: '40px', height: '20px' }} />
                  <label className="form-check-label ms-2" style={{ fontWeight: 600 }}>Active Status</label>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn-primary-custom" disabled={saving}>
                {saving ? 'Saving...' : <><i className="bi bi-check2"></i> {editId ? 'Update' : 'Create'} Banner</>}
              </button>
              <button type="button" className="btn-outline-custom" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card-custom" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="p-4"><Spinner /></div> : (
          <table className="table-custom">
            <thead><tr><th>Banner</th><th>Link</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {banners.map(banner => (
                <tr key={banner._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img src={banner.imageUrl.startsWith('http') ? banner.imageUrl : `http://localhost:5000${banner.imageUrl}`} style={{ height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} alt="" />
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{banner.title}</span>
                    </div>
                  </td>
                  <td><code style={{ color: 'var(--primary-light)', fontSize: '12px' }}>{banner.linkUrl || '—'}</code></td>
                  <td>{banner.sortOrder}</td>
                  <td><span className={banner.isActive ? 'badge-success' : 'badge-danger'}>{banner.isActive ? 'Active' : 'Hidden'}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <button onClick={() => openEdit(banner)} style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(108,62,244,0.15)', border: '1px solid var(--primary)', color: 'var(--primary-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button onClick={() => handleDelete(banner._id, banner.title)} style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
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

export default ManageBanners;
