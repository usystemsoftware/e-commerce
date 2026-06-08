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

  const stars = "★".repeat(Math.floor(product.ratings || 0)) + ((product.ratings || 0) % 1 >= 0.5 ? "½" : "") + "☆".repeat(5 - Math.ceil(product.ratings || 0));

  return (
    <div className="product-card-neo">
      <div className="product-neo-img-wrap">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images?.[0] ? product.images[0] : `https://picsum.photos/seed/${product._id}/400/300`}
            alt={product.name}
            loading="lazy"
          />
        </Link>
        {discountPercent > 0 && <span className="discount-neo-tag">-{discountPercent}%</span>}
        {product.isFeatured && <span className="new-neo-tag">HOT</span>}
        <div className="product-neo-actions">
          <button 
            className="product-neo-action-btn" 
            onClick={() => wishlisted ? removeFromWishlist(product._id) : addToWishlist(product._id)} 
            title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <i className={`bi bi-heart${wishlisted ? '-fill' : ''}`} style={{ color: wishlisted ? 'var(--hot)' : undefined }}></i>
          </button>
          <Link to={`/products/${product._id}`} className="product-neo-action-btn" title="Quick view">
            <i className="bi bi-eye"></i>
          </Link>
          <button 
            className="product-neo-action-btn" 
            onClick={() => addToCart(product._id, 1)} 
            disabled={product.stock === 0}
            title="Add to cart"
          >
            <i className="bi bi-cart-plus"></i>
          </button>
        </div>
      </div>
      <div className="product-neo-body">
        <div className="product-neo-brand">{product.brand}</div>
        <Link to={`/products/${product._id}`} className="text-decoration-none">
          <div className="product-neo-name">{product.name}</div>
        </Link>
        <div className="product-neo-rating">
          <span className="stars-neo">{stars.slice(0,5)}</span>
          <span className="rating-neo-num">{product.ratings || 0} ({(product.numReviews || 0).toLocaleString()})</span>
        </div>
        <div className="product-neo-price">
          <span className="price-neo-now">₹{currentPrice.toLocaleString()}</span>
          {product.discountPrice > 0 && <span className="price-neo-was">₹{product.price.toLocaleString()}</span>}
        </div>
        <button 
          className="add-neo-btn" 
          onClick={() => addToCart(product._id, 1)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'} <i className="bi bi-plus-lg" style={{ fontSize: 14 }}></i>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
