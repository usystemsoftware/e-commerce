import React, { useState, useEffect } from 'react';
import { getSubscribersAPI, deleteSubscriberAPI } from '../../services/api';
import { toast } from 'react-toastify';
import AdminLayout from './AdminLayout';

const ManageSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await getSubscribersAPI();
      setSubscribers(res.data);
    } catch (error) {
      toast.error('Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await deleteSubscriberAPI(id);
        toast.success('Subscriber deleted');
        fetchSubscribers();
      } catch (error) {
        toast.error('Failed to delete subscriber');
      }
    }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <AdminLayout>
      <div className="glass-panel" style={{ borderRadius: 'var(--radius)', padding: '24px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 style={{ fontWeight: 700, margin: 0 }}>Newsletter Subscribers</h4>
          <span className="badge-primary">{subscribers.length} Total</span>
        </div>

      <div className="table-responsive">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Date Subscribed</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr><td colSpan="3" className="text-center">No subscribers found</td></tr>
            ) : (
              subscribers.map(sub => (
                <tr key={sub._id}>
                  <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td>{sub.email}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => deleteSubscriber(sub._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </AdminLayout>
  );
};

export default ManageSubscribers;
