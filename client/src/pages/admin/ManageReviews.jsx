import React, { useState, useEffect } from 'react';
import { getAdminReviewsAPI, deleteAdminReviewAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await getAdminReviewsAPI();
      setReviews(res.data);
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (productId, reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteAdminReviewAPI(productId, reviewId);
        toast.success('Review deleted');
        fetchReviews();
      } catch (error) {
        toast.error('Failed to delete review');
      }
    }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <AdminLayout>
      <div className="glass-panel" style={{ borderRadius: 'var(--radius)', padding: '24px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 style={{ fontWeight: 700, margin: 0 }}>Product Reviews</h4>
      </div>

      <div className="table-responsive">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No reviews found</td></tr>
            ) : (
              reviews.map(review => (
                <tr key={review._id}>
                  <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/product/${review.productId}`} target="_blank" className="text-decoration-none">
                      {review.productName}
                    </Link>
                  </td>
                  <td>{review.name}</td>
                  <td>
                    <span style={{ color: '#fbbf24' }}>
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                  </td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={review.comment}>
                    {review.comment}
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => deleteReview(review.productId, review._id)}
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

export default ManageReviews;
