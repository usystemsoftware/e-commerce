import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { createProductAPI, getCategoriesAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '', category: '',
    brand: '', stock: '', isFeatured: false, isActive: true, tags: '',
  });

  useEffect(() => { getCategoriesAPI().then(r => setCategories(r.data)); }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach(img => formData.append('images', img));
      await createProductAPI(formData);
      toast.success('Product created!');
      navigate('/admin/products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setLoading(false); }
  };

  return (
    <AdminLayout>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button onClick={() => navigate('/admin/products')} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', fontSize: '14px' }}>
          <i className="bi bi-arrow-left me-1"></i>Back
        </button>
        <h2 style={{ fontWeight: 800, margin: 0 }}>Add New Product</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card-custom mb-4">
              <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>Product Information</h5>
              <div className="row g-3">
                <div className="col-12">
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Product Name *</label>
                  <input className="form-control-custom" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="e.g. iPhone 15 Pro" />
                </div>
                <div className="col-12">
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Description *</label>
                  <textarea className="form-control-custom" rows="4" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required placeholder="Detailed product description..."></textarea>
                </div>
                <div className="col-md-6">
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Category *</label>
                  <select className="form-control-custom" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Brand</label>
                  <input className="form-control-custom" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="e.g. Apple" />
                </div>
                <div className="col-md-4">
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>MRP (₹) *</label>
                  <input className="form-control-custom" type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required placeholder="0" />
                </div>
                <div className="col-md-4">
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Sale Price (₹)</label>
                  <input className="form-control-custom" type="number" min="0" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))} placeholder="Leave 0 for no discount" />
                </div>
                <div className="col-md-4">
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Stock *</label>
                  <input className="form-control-custom" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required placeholder="0" />
                </div>
                <div className="col-12">
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Tags (comma-separated)</label>
                  <input className="form-control-custom" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="electronics, smartphone, 5G" />
                </div>
              </div>
            </div>

            <div className="card-custom">
              <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>Product Images</h5>
              <label style={{ display: 'block', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', padding: '32px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onDragOver={e => e.preventDefault()}>
                <i className="bi bi-cloud-upload" style={{ fontSize: '32px', color: 'var(--primary-light)', marginBottom: '12px', display: 'block' }}></i>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Click to upload or drag & drop</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>PNG, JPG, WebP up to 5MB each (max 5 images)</div>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
              {previews.length > 0 && (
                <div className="d-flex gap-3 mt-3 flex-wrap">
                  {previews.map((src, i) => (
                    <img key={i} src={src} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} alt="" />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card-custom mb-4">
              <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>Settings</h5>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px' }}>Active (Visible on store)</span>
                <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', inset: 0, background: form.isActive ? 'var(--primary)' : 'var(--border)', borderRadius: '12px', transition: '0.3s' }}>
                    <span style={{ position: 'absolute', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', top: '3px', left: form.isActive ? '23px' : '3px', transition: '0.3s' }}></span>
                  </span>
                </label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                <span style={{ fontSize: '14px' }}>Featured Product</span>
                <label style={{ position: 'relative', width: '44px', height: '24px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', inset: 0, background: form.isFeatured ? 'var(--primary)' : 'var(--border)', borderRadius: '12px', transition: '0.3s' }}>
                    <span style={{ position: 'absolute', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', top: '3px', left: form.isFeatured ? '23px' : '3px', transition: '0.3s' }}></span>
                  </span>
                </label>
              </div>
            </div>
            <button type="submit" className="btn-primary-custom w-100 justify-content-center" style={{ padding: '14px', fontSize: '15px' }} disabled={loading}>
              {loading ? 'Creating...' : <><i className="bi bi-plus-circle"></i> Create Product</>}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddProduct;
