import React from 'react';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const Compare = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (!compareItems || compareItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="empty-state">
          <i className="bi bi-layers" style={{ fontSize: '48px', color: 'var(--text-muted)' }}></i>
          <h3 className="mt-3">Compare List is Empty</h3>
          <p className="text-muted">Add products to compare their features side-by-side.</p>
          <Link to="/products" className="btn-primary-custom mt-3">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Compare Products</h2>
        <button onClick={clearCompare} className="btn-outline-custom text-danger border-danger">
          Clear All
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle text-center" style={{ minWidth: '800px', background: 'var(--card-bg)' }}>
          <thead style={{ background: 'var(--dark-3)' }}>
            <tr>
              <th style={{ width: '20%' }}>Features</th>
              {compareItems.map(item => (
                <th key={item._id} style={{ width: `${80 / compareItems.length}%` }}>
                  <div className="position-relative">
                    <button 
                      onClick={() => removeFromCompare(item._id)} 
                      className="btn-close position-absolute top-0 end-0 m-2" 
                      style={{ filter: 'invert(1)' }}
                    ></button>
                    <img 
                      src={item.images?.[0] || `https://picsum.photos/seed/${item._id}/150/150`} 
                      alt={item.name} 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
                    />
                    <div className="mt-2 text-truncate px-2" style={{ maxWidth: '100%' }}>{item.name}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fw-bold text-start ps-4">Price</td>
              {compareItems.map(item => (
                <td key={item._id}>
                  <div className="fw-bold" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                    ₹{(item.discountPrice > 0 ? item.discountPrice : item.price).toLocaleString()}
                  </div>
                  {item.discountPrice > 0 && (
                    <div className="text-decoration-line-through text-muted" style={{ fontSize: '0.9rem' }}>
                      ₹{item.price.toLocaleString()}
                    </div>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="fw-bold text-start ps-4">Brand</td>
              {compareItems.map(item => (
                <td key={item._id}>{item.brand || 'N/A'}</td>
              ))}
            </tr>
            <tr>
              <td className="fw-bold text-start ps-4">Category</td>
              {compareItems.map(item => (
                <td key={item._id}>{item.category?.name || 'N/A'}</td>
              ))}
            </tr>
            <tr>
              <td className="fw-bold text-start ps-4">Rating</td>
              {compareItems.map(item => (
                <td key={item._id}>
                  <div className="d-flex justify-content-center align-items-center gap-1 text-warning">
                    <i className="bi bi-star-fill"></i>
                    <span className="text-white">{item.ratings?.toFixed(1) || '0.0'}</span>
                    <span className="text-muted ms-1">({item.numReviews || 0})</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="fw-bold text-start ps-4">Stock Status</td>
              {compareItems.map(item => (
                <td key={item._id}>
                  {item.stock > 0 ? (
                    <span className="badge bg-success">In Stock ({item.stock})</span>
                  ) : (
                    <span className="badge bg-danger">Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="fw-bold text-start ps-4">Action</td>
              {compareItems.map(item => (
                <td key={item._id}>
                  <button 
                    onClick={() => addToCart(item._id, 1)} 
                    disabled={item.stock === 0} 
                    className="btn-primary-custom py-2 px-3 w-100 justify-content-center"
                    style={{ fontSize: '13px' }}
                  >
                    <i className="bi bi-cart-plus me-1"></i> Add
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
