import React, { useState, useEffect } from 'react';
import { getContactsAPI, updateContactStatusAPI, deleteContactAPI } from '../../services/api';
import { toast } from 'react-toastify';
import AdminLayout from './AdminLayout';

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await getContactsAPI();
      setContacts(res.data);
    } catch (error) {
      toast.error('Failed to fetch contact queries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await updateContactStatusAPI(id, status);
      toast.success('Status updated');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      try {
        await deleteContactAPI(id);
        toast.success('Query deleted');
        fetchContacts();
      } catch (error) {
        toast.error('Failed to delete query');
      }
    }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <AdminLayout>
      <div className="glass-panel" style={{ borderRadius: 'var(--radius)', padding: '24px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 style={{ fontWeight: 700, margin: 0 }}>Contact Queries</h4>
        </div>

      <div className="table-responsive">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No queries found</td></tr>
            ) : (
              contacts.map(contact => (
                <tr key={contact._id}>
                  <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.subject}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={contact.message}>
                    {contact.message}
                  </td>
                  <td>
                    <span className={`badge-${contact.status === 'Resolved' ? 'success' : 'warning'}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-success" 
                        onClick={() => updateStatus(contact._id, contact.status === 'Resolved' ? 'Pending' : 'Resolved')}
                        title="Toggle Status"
                      >
                        <i className="bi bi-check-circle"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => deleteContact(contact._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
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

export default ManageContacts;
