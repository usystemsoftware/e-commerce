import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const discountPercent = product.discountPercent || (product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0);

  // Simulated data for Alibaba style
  const soldCount = (product.numReviews || 0) * 10 + Math.floor(Math.random() * 50) + 10;
  const supplierYears = Math.floor(Math.random() * 10) + 1;

  return (
    <div className="alibaba-card">
      <div className="alibaba-card-img-wrap">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images?.[0] ? product.images[0] : `https://picsum.photos/seed/${product._id}/400/400`}
            alt={product.name}
            loading="lazy"
          />
        </Link>
        <div className="alibaba-quick-actions">
          <button 
            className="alibaba-quick-btn" 
            onClick={() => wishlisted ? removeFromWishlist(product._id) : addToWishlist(product._id)}
            title="Wishlist"
          >
            <i className={`bi bi-heart${wishlisted ? '-fill' : ''}`} style={{ color: wishlisted ? '#ff4757' : '#555' }}></i>
          </button>
          <button 
            className="alibaba-quick-btn" 
            onClick={() => addToCart(product._id, 1)}
            disabled={product.stock === 0}
            title="Add to cart"
          >
            <i className="bi bi-cart-plus"></i>
          </button>
        </div>
      </div>
      <div className="alibaba-card-body">
        <Link to={`/products/${product._id}`} className="alibaba-card-title">
          {product.name}
        </Link>
        
        <div className="alibaba-badge-row">
          {discountPercent > 0 ? (
            <span className="alibaba-badge text-danger">
              <i className="bi bi-graph-down-arrow"></i> Lower priced than similar
            </span>
          ) : (
            <span className="alibaba-badge text-success">
              <i className="bi bi-truck"></i> Ready to ship
            </span>
          )}
        </div>

        <div className="alibaba-card-price">
          ₹{currentPrice.toLocaleString()}
          {product.discountPrice > 0 && <span className="alibaba-old-price">₹{product.price.toLocaleString()}</span>}
        </div>

        <div className="alibaba-card-meta">
          <span className="moq-text">MOQ: {product.stock > 0 ? '1 piece' : 'Out of stock'}</span>
          <span className="sold-count">{soldCount.toLocaleString()} sold</span>
        </div>

        <div className="alibaba-card-supplier">
          <span className="verified-badge"><i className="bi bi-patch-check-fill"></i> Verified</span>
          <span className="supplier-info">· {supplierYears} yrs · IN</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
