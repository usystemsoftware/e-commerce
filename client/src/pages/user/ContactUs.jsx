import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { submitContactAPI } from '../../services/api';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitContactAPI(form);
      toast.success('Your message has been sent successfully!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ marginTop: '20px', minHeight: '60vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card-custom">
            <div className="text-center mb-4">
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>Contact Us</h2>
              <p className="text-muted">We'd love to hear from you. Send us a message!</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control-custom" 
                  value={form.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  className="form-control-custom" 
                  value={form.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  className="form-control-custom" 
                  value={form.subject} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label className="form-label" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Message</label>
                <textarea 
                  name="message" 
                  className="form-control-custom" 
                  rows="5" 
                  value={form.message} 
                  onChange={handleChange} 
                  required 
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn-primary-custom w-100 justify-content-center"
                disabled={loading}
              >
                {loading ? 'Sending...' : <><i className="bi bi-send"></i> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
