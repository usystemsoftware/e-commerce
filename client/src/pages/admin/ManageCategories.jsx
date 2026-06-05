import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getAllCategoriesAPI, createCategoryAPI, updateCategoryAPI, deleteCategoryAPI } from '../../services/api';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';

const emptyForm = { name: '', description: '', parentCategory: '' };

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    getAllCategoriesAPI().then(r => setCategories(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openEdit = (cat) => {
    setEditId(cat._id);
    setForm({ name: cat.name, description: cat.description || '', parentCategory: cat.parentCategory?._id || '' });
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
      if (editId) {
        await updateCategoryAPI(editId, fd);
        toast.success('Category updated');
      } else {
        await createCategoryAPI(fd);
        toast.success('Category created');
      }
      resetForm();
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategoryAPI(id);
      toast.success('Category deleted');
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontWeight: 800, margin: 0 }}>Categories</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>{categories.length} categories</p>
        </div>
        <button className="btn-primary-custom" onClick={() => { resetForm(); setShowForm(true); }}>
          <i className="bi bi-plus-lg"></i> Add Category
        </button>
      </div>

      {showForm && (
        <div className="card-custom mb-4">
          <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>{editId ? 'Edit Category' : 'New Category'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Name *</label>
                <input className="form-control-custom" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Parent Category</label>
                <select className="form-control-custom" value={form.parentCategory} onChange={e => setForm(f => ({ ...f, parentCategory: e.target.value }))}>
                  <option value="">None (Top-level)</option>
                  {categories.filter(c => c._id !== editId).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Description</label>
                <input className="form-control-custom" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" />
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Category Image</label>
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="form-control-custom" style={{ padding: '10px 14px' }} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn-primary-custom" disabled={saving}>
                {saving ? 'Saving...' : <><i className="bi bi-check2"></i> {editId ? 'Update' : 'Create'} Category</>}
              </button>
              <button type="button" className="btn-outline-custom" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card-custom" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="p-4"><Spinner /></div> : (
          <table className="table-custom">
            <thead><tr><th>Category</th><th>Slug</th><th>Parent</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      {cat.image ? (
                        <img src={cat.image} style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} alt="" />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(108,62,244,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                          <i className="bi bi-tag" style={{ color: 'var(--primary-light)' }}></i>
                        </div>
                      )}
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{cat.name}</span>
                    </div>
                  </td>
                  <td><code style={{ color: 'var(--primary-light)', fontSize: '12px' }}>{cat.slug}</code></td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{cat.parentCategory?.name || '—'}</td>
                  <td><span className={cat.isActive ? 'badge-success' : 'badge-danger'}>{cat.isActive ? 'Active' : 'Hidden'}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <button onClick={() => openEdit(cat)} style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(108,62,244,0.15)', border: '1px solid var(--primary)', color: 'var(--primary-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button onClick={() => handleDelete(cat._id, cat.name)} style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
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

export default ManageCategories;
