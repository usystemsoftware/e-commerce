import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfileAPI, changePasswordAPI, addAddressAPI, deleteAddressAPI } from '../../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [addrForm, setAddrForm] = useState({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '', isDefault: false });
  const [showAddrForm, setShowAddrForm] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfileAPI(profileForm);
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) { toast.error('Failed to update'); } finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      await changePasswordAPI({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSaving(false); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addAddressAPI(addrForm);
      setAddresses(data);
      setShowAddrForm(false);
      toast.success('Address added!');
    } catch { toast.error('Failed to add address'); }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const { data } = await deleteAddressAPI(id);
      setAddresses(data);
      toast.success('Address removed');
    } catch { toast.error('Failed'); }
  };

  const tabs = ['profile', 'password', 'addresses'];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <div className="d-flex align-items-center gap-4">
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 style={{ margin: 0 }}>{user?.name}</h1>
              <p style={{ margin: 0 }}>{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container pb-5">
        <div className="row g-4">
          <div className="col-lg-3">
            <div className="card-custom">
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', background: tab === t ? 'rgba(108,62,244,0.15)' : 'transparent', border: 'none', color: tab === t ? 'var(--primary-light)' : 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontFamily: 'Outfit', fontSize: '14px', textTransform: 'capitalize', marginBottom: '4px', textAlign: 'left'
                }}>
                  <i className={`bi bi-${t === 'profile' ? 'person' : t === 'password' ? 'lock' : 'geo-alt'}`}></i> {t}
                </button>
              ))}
            </div>
          </div>
          <div className="col-lg-9">
            {tab === 'profile' && (
              <div className="card-custom">
                <h5 style={{ fontWeight: 700, marginBottom: '24px' }}>Personal Information</h5>
                <form onSubmit={handleProfileSave}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Full Name</label>
                      <input className="form-control-custom" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Email (read-only)</label>
                      <input className="form-control-custom" value={user?.email} readOnly style={{ opacity: 0.6 }} />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Phone</label>
                      <input className="form-control-custom" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary-custom mt-4" disabled={saving}>
                    {saving ? 'Saving...' : <><i className="bi bi-check2"></i> Save Changes</>}
                  </button>
                </form>
              </div>
            )}
            {tab === 'password' && (
              <div className="card-custom">
                <h5 style={{ fontWeight: 700, marginBottom: '24px' }}>Change Password</h5>
                <form onSubmit={handlePasswordChange}>
                  {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([key, label]) => (
                    <div key={key} className="mb-3">
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>{label}</label>
                      <input className="form-control-custom" type="password" value={pwForm[key]} onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))} required />
                    </div>
                  ))}
                  <button type="submit" className="btn-primary-custom" disabled={saving}>
                    {saving ? 'Updating...' : <><i className="bi bi-lock"></i> Update Password</>}
                  </button>
                </form>
              </div>
            )}
            {tab === 'addresses' && (
              <div className="card-custom">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 style={{ fontWeight: 700, margin: 0 }}>Saved Addresses</h5>
                  <button className="btn-outline-custom" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setShowAddrForm(v => !v)}>
                    <i className="bi bi-plus-lg"></i> Add New
                  </button>
                </div>
                {showAddrForm && (
                  <form onSubmit={handleAddAddress} style={{ background: 'var(--dark-3)', borderRadius: 'var(--radius-sm)', padding: '20px', marginBottom: '20px' }}>
                    <div className="row g-3">
                      {[['fullName', 'Full Name'], ['phone', 'Phone'], ['street', 'Street'], ['city', 'City'], ['state', 'State'], ['pincode', 'Pincode']].map(([k, l]) => (
                        <div key={k} className={k === 'street' ? 'col-12' : 'col-md-6'}>
                          <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>{l}</label>
                          <input className="form-control-custom" value={addrForm[k]} onChange={e => setAddrForm(f => ({ ...f, [k]: e.target.value }))} required style={{ padding: '8px 12px', fontSize: '13px' }} />
                        </div>
                      ))}
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button type="submit" className="btn-primary-custom" style={{ padding: '8px 20px', fontSize: '13px' }}>Save Address</button>
                      <button type="button" className="btn-outline-custom" style={{ padding: '8px 20px', fontSize: '13px' }} onClick={() => setShowAddrForm(false)}>Cancel</button>
                    </div>
                  </form>
                )}
                {addresses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <i className="bi bi-geo-alt" style={{ fontSize: '40px', marginBottom: '12px', display: 'block' }}></i>
                    No addresses saved yet
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {addresses.map(addr => (
                      <div key={addr._id} style={{ background: 'var(--dark-3)', borderRadius: 'var(--radius-sm)', padding: '16px', border: `1px solid ${addr.isDefault ? 'var(--primary)' : 'var(--border)'}` }}>
                        <div className="d-flex justify-content-between">
                          <div>
                            {addr.isDefault && <span className="badge-primary mb-2 d-inline-block">Default</span>}
                            <div style={{ fontWeight: 600 }}>{addr.fullName}</div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {addr.phone} • {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                            </div>
                          </div>
                          <button onClick={() => handleDeleteAddress(addr._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '18px', alignSelf: 'flex-start' }}>
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
