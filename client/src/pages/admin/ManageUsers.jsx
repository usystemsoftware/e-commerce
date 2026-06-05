import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getAllUsersAPI, updateUserStatusAPI, deleteUserAPI } from '../../services/api';
import Spinner from '../../components/Spinner/Spinner';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsersAPI({ keyword: search, page });
      setUsers(data.users);
      setPages(data.pages);
      setTotal(data.total);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => {
    const t = setTimeout(fetchUsers, 400);
    return () => clearTimeout(t);
  }, [search, page]);

  const handleToggleBlock = async (id, isBlocked) => {
    setUpdating(id);
    try {
      await updateUserStatusAPI(id, { isBlocked: !isBlocked });
      toast.success(isBlocked ? 'User unblocked' : 'User blocked');
      fetchUsers();
    } catch { toast.error('Failed'); } finally { setUpdating(null); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await deleteUserAPI(id);
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch { toast.error('Failed to delete user'); }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 style={{ fontWeight: 800, margin: 0 }}>Manage Users</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>{total} registered users</p>
        </div>
      </div>

      <div className="card-custom" style={{ padding: '20px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '340px' }}>
          <i className="bi bi-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}></i>
          <input
            className="form-control-custom"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: '38px' }}
          />
        </div>
      </div>

      <div className="card-custom" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? <div className="p-4"><Spinner /></div> : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <i className="bi bi-people" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}></i>
            No users found
          </div>
        ) : (
          <table className="table-custom">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>{user.name}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px' }}>{user.email}</td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user.phone || '—'}</td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <span className={user.isBlocked ? 'badge-danger' : 'badge-success'}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                        disabled={updating === user._id}
                        title={user.isBlocked ? 'Unblock' : 'Block'}
                        style={{
                          width: '34px', height: '34px', borderRadius: 'var(--radius-sm)',
                          background: user.isBlocked ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                          border: `1px solid ${user.isBlocked ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                          color: user.isBlocked ? 'var(--success)' : 'var(--warning)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px',
                        }}
                      >
                        <i className={`bi bi-${user.isBlocked ? 'unlock' : 'lock'}`}></i>
                      </button>
                      <button
                        onClick={() => handleDelete(user._id, user.name)}
                        style={{
                          width: '34px', height: '34px', borderRadius: 'var(--radius-sm)',
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                          color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px',
                        }}
                      >
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

      {pages > 1 && (
        <div className="pagination-custom mt-4">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><i className="bi bi-chevron-left"></i></button>
          {[...Array(pages)].map((_, i) => (
            <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
          <button className="page-btn" disabled={page === pages} onClick={() => setPage(p => p + 1)}><i className="bi bi-chevron-right"></i></button>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageUsers;
