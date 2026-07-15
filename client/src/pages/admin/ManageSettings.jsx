import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getSettingsAPI, updateSettingsAPI } from '../../services/api';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';

const ManageSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    storeName: '',
    logoUrl: '',
    contactEmail: '',
    contactPhone: '',
    currency: 'INR',
    currencySymbol: '₹',
    address: '',
    socialLinks: { facebook: '', twitter: '', instagram: '' }
  });

  useEffect(() => {
    getSettingsAPI()
      .then(res => {
        if (res.data) {
          setForm({
            storeName: res.data.storeName || '',
            logoUrl: res.data.logoUrl || '',
            contactEmail: res.data.contactEmail || '',
            contactPhone: res.data.contactPhone || '',
            currency: res.data.currency || 'INR',
            currencySymbol: res.data.currencySymbol || '₹',
            address: res.data.address || '',
            socialLinks: res.data.socialLinks || { facebook: '', twitter: '', instagram: '' }
          });
        }
      })
      .catch(err => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const socialName = name.split('_')[1];
      setForm(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialName]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettingsAPI(form);
      toast.success('Settings updated successfully');
    } catch (err) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminLayout><div className="p-4"><Spinner /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 style={{ fontWeight: 800, margin: 0 }}>Site Settings</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>Manage global configuration</p>
        </div>
      </div>

      <div className="card-custom">
        <form onSubmit={handleSubmit}>
          <h5 style={{ fontWeight: 700, marginBottom: '20px' }}>General Information</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Store Name *</label>
              <input name="storeName" className="form-control-custom" value={form.storeName} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Logo URL</label>
              <input name="logoUrl" className="form-control-custom" value={form.logoUrl} onChange={handleChange} placeholder="https://example.com/logo.png" />
            </div>
            <div className="col-md-6">
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Contact Email</label>
              <input type="email" name="contactEmail" className="form-control-custom" value={form.contactEmail} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Contact Phone</label>
              <input name="contactPhone" className="form-control-custom" value={form.contactPhone} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Currency Code</label>
              <input name="currency" className="form-control-custom" value={form.currency} onChange={handleChange} placeholder="e.g. INR, USD" />
            </div>
            <div className="col-md-6">
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Currency Symbol</label>
              <input name="currencySymbol" className="form-control-custom" value={form.currencySymbol} onChange={handleChange} placeholder="e.g. ₹, $" />
            </div>
            <div className="col-12">
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Address</label>
              <input name="address" className="form-control-custom" value={form.address} onChange={handleChange} />
            </div>
          </div>

          <h5 style={{ fontWeight: 700, marginBottom: '20px', marginTop: '30px' }}>Social Links</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Facebook</label>
              <input name="social_facebook" className="form-control-custom" value={form.socialLinks.facebook} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Twitter / X</label>
              <input name="social_twitter" className="form-control-custom" value={form.socialLinks.twitter} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Instagram</label>
              <input name="social_instagram" className="form-control-custom" value={form.socialLinks.instagram} onChange={handleChange} />
            </div>
          </div>

          <div className="mt-5">
            <button type="submit" className="btn-primary-custom" disabled={saving}>
              {saving ? 'Saving...' : <><i className="bi bi-save"></i> Save Settings</>}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ManageSettings;
