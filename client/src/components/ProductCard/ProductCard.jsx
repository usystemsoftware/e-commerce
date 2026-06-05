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

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`bi bi-star${i < full ? '-fill' : (half && i === full ? '-half' : '')}`} style={{ color: '#fbbf24', fontSize: '13px' }}></i>
    ));
  };

  return (
    <div className="product-card">
      {discountPercent > 0 && (
        <div className="product-discount-badge">{discountPercent}% OFF</div>
      )}
      <div className="product-img-wrapper">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images?.[0] ? product.images[0] : `https://picsum.photos/seed/${product._id}/400/300`}
            alt={product.name}
          />
        </Link>
        <div className="product-overlay">
          <button
            className="product-overlay-btn"
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => wishlisted ? removeFromWishlist(product._id) : addToWishlist(product._id)}
          >
            <i className={`bi bi-heart${wishlisted ? '-fill' : ''}`} style={{ color: wishlisted ? 'var(--danger)' : undefined }}></i>
          </button>
          <Link to={`/products/${product._id}`} className="product-overlay-btn" title="Quick View">
            <i className="bi bi-eye"></i>
          </Link>
        </div>
      </div>
      <div className="product-body">
        <div className="product-brand">{product.brand}</div>
        <Link to={`/products/${product._id}`} className="text-decoration-none">
          <div className="product-name">{product.name}</div>
        </Link>
        <div className="product-rating">
          <div className="stars">{renderStars(product.ratings || 0)}</div>
          <span className="rating-count">({product.numReviews || 0})</span>
        </div>
        <div className="product-price">
          <span className="price-current">₹{currentPrice.toLocaleString()}</span>
          {product.discountPrice > 0 && (
            <span className="price-original">₹{product.price.toLocaleString()}</span>
          )}
        </div>
        <button
          className="add-to-cart-btn"
          onClick={() => addToCart(product._id, 1)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? (
            <><i className="bi bi-x-circle"></i> Out of Stock</>
          ) : (
            <><i className="bi bi-bag-plus"></i> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
