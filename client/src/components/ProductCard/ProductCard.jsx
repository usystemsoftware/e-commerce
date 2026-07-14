import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  const currentPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  
  // Dummy logic for 'Bank offer' text to replicate screenshot
  const offerText = `₹${Math.max(Math.floor(currentPrice * 0.93), currentPrice - 50).toLocaleString()} with Bank offer + more`;

  return (
    <div className="product-card-flip">
      <div className="product-flip-img-wrap">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images?.[0] ? product.images[0] : `https://picsum.photos/seed/${product._id}/400/300`}
            alt={product.name}
            loading="lazy"
          />
        </Link>
        <div className="product-flip-rating">
          <span>{product.ratings ? Number(product.ratings).toFixed(1) : "4.0"} <i className="bi bi-star-fill"></i></span>
          <span className="rating-count">({(product.numReviews || 0).toLocaleString()})</span>
        </div>
      </div>
      
      <div className="product-flip-body">
        <div className="product-flip-title-row">
          <span className="product-flip-brand">{product.brand || 'Brand'}</span>
          <span className="product-flip-name">{product.name}</span>
        </div>
        <div className="product-flip-price-row">
          {product.discountPrice > 0 ? (
            <>
              <span className="product-flip-price-old">₹{product.price.toLocaleString()}</span>
              <span className="product-flip-price-new">₹{product.discountPrice.toLocaleString()}</span>
            </>
          ) : (
            <span className="product-flip-price-new">₹{product.price.toLocaleString()}</span>
          )}
        </div>
        <div className="product-flip-offer">
          {offerText}
        </div>
      </div>
      
      <button 
        className="product-flip-wishlist"
        onClick={(e) => {
          e.preventDefault();
          wishlisted ? removeFromWishlist(product._id) : addToWishlist(product._id);
        }}
        title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <i className={`bi bi-heart${wishlisted ? '-fill' : ''}`} style={{ color: wishlisted ? '#ff4343' : '#c2c2c2' }}></i>
      </button>

      {/* Hidden button that appears on hover to maintain functionality */}
      <button 
        className="product-flip-add" 
        onClick={(e) => {
          e.preventDefault();
          addToCart(product._id, 1);
        }}
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
      </button>
    </div>
  );
};

export default ProductCard;
