import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getAllPagesAdminAPI, createPageAPI, updatePageAPI, deletePageAPI } from '../../services/api';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';

const emptyForm = { title: '', slug: '', content: '', isActive: true };

const ManagePages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchPages = () => {
    getAllPagesAdminAPI().then(r => setPages(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPages(); }, []);

  const openEdit = (page) => {
    setEditId(page._id);
    setForm({ 
      title: page.title, 
      slug: page.slug, 
      content: page.content, 
      isActive: page.isActive 
    });
    setShowForm(true);
  };

  const resetForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setForm(prev => ({ ...prev, title, slug: editId ? prev.slug : slug }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await updatePageAPI(editId, form);
        toast.success('Page updated');
      } else {
        await createPageAPI(form);
        toast.success('Page created');
      }
      resetForm();
      fetchPages();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete page "${title}"?`)) return;
    try {
      await deletePageAPI(id);
      toast.success('Page deleted');
      setPages(prev => prev.filter(p => p._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontWeight: 800, margin: 0 }}>Pages (CMS)</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>{pages.length} custom pages</p>
        </div>
        <button className="btn-primary-custom" onClick={() => { resetForm(); setShowForm(true); }}>
          <i className="bi bi-plus-lg"></i> Add Page
        </button>
      </div>

      {showForm && (
        <div className="card-custom mb-4">
          <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>{editId ? 'Edit Page' : 'New Page'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Page Title *</label>
                <input className="form-control-custom" value={form.title} onChange={handleTitleChange} required />
              </div>
              <div className="col-md-6">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Slug (URL) *</label>
                <input className="form-control-custom" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))} required />
              </div>
              <div className="col-12">
                <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Content (HTML supported) *</label>
                <textarea className="form-control-custom" style={{ minHeight: '300px', fontFamily: 'monospace' }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required placeholder="<h1>Hello</h1><p>Welcome to our page</p>" />
              </div>
              <div className="col-12 d-flex align-items-end mt-3">
                <div className="form-check form-switch mb-2">
                  <input className="form-check-input" type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ width: '40px', height: '20px' }} />
                  <label className="form-check-label ms-2" style={{ fontWeight: 600 }}>Active Status</label>
                </div>
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn-primary-custom" disabled={saving}>
                {saving ? 'Saving...' : <><i className="bi bi-check2"></i> {editId ? 'Update' : 'Create'} Page</>}
              </button>
              <button type="button" className="btn-outline-custom" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card-custom" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="p-4"><Spinner /></div> : (
          <table className="table-custom">
            <thead><tr><th>Title</th><th>Slug</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
            <tbody>
              {pages.map(page => (
                <tr key={page._id}>
                  <td style={{ fontWeight: 600 }}>{page.title}</td>
                  <td><code style={{ fontSize: '12px', color: 'var(--primary-light)' }}>/page/{page.slug}</code></td>
                  <td><span className={page.isActive ? 'badge-success' : 'badge-danger'}>{page.isActive ? 'Active' : 'Hidden'}</span></td>
                  <td>{new Date(page.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <a href={`/page/${page.slug}`} target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', textDecoration: 'none' }}>
                        <i className="bi bi-box-arrow-up-right"></i>
                      </a>
                      <button onClick={() => openEdit(page)} style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(108,62,244,0.15)', border: '1px solid var(--primary)', color: 'var(--primary-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button onClick={() => handleDelete(page._id, page.title)} style={{ width: '34px', height: '34px', borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
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

export default ManagePages;
