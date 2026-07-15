import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const products = wishlist.products || [];

  if (products.length === 0) return (
    <div className="container py-5">
      <div className="empty-state">
        <i className="bi bi-heart"></i>
        <h3>Your Wishlist is Empty</h3>
        <p>Save products you love to your wishlist!</p>
        <Link to="/products" className="btn-primary-custom">Explore Products</Link>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1><i className="bi bi-heart me-2"></i>My Wishlist</h1>
          <p>{products.length} item(s) saved</p>
        </div>
      </div>
      <div className="container pb-5">
        <div className="row g-4">
          {products.map(product => {
            const price = product.discountPrice > 0 ? product.discountPrice : product.price;
            return (
              <div key={product._id} className="col-6 col-md-4 col-lg-3">
                <div className="product-card">
                  <div className="product-img-wrapper">
                    <Link to={`/products/${product._id}`}>
                      <img src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/400/300`} alt={product.name} />
                    </Link>
                    <div className="product-overlay">
                      <button className="product-overlay-btn" onClick={() => removeFromWishlist(product._id)} title="Remove from wishlist">
                        <i className="bi bi-heart-fill" style={{ color: 'var(--danger)' }}></i>
                      </button>
                    </div>
                  </div>
                  <div className="product-body">
                    <div className="product-name"><Link to={`/products/${product._id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{product.name}</Link></div>
                    <div className="product-price mt-1 mb-2">
                      <span className="price-current">₹{price?.toLocaleString()}</span>
                      {product.discountPrice > 0 && <span className="price-original">₹{product.price?.toLocaleString()}</span>}
                    </div>
                    <div className="d-flex gap-2">
                      <button className="add-to-cart-btn" style={{ flex: 1, marginTop: 0 }} onClick={() => addToCart(product._id, 1)} disabled={product.stock === 0}>
                        {product.stock === 0 ? 'Out of Stock' : <><i className="bi bi-bag-plus"></i> Add to Cart</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
