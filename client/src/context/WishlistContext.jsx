import { createContext, useContext, useState, useEffect } from 'react';
import { getWishlistAPI, addToWishlistAPI, removeFromWishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const { user } = useAuth();

  const fetchWishlist = async () => {
    if (!user || user.role === 'admin') return;
    try {
      const { data } = await getWishlistAPI();
      setWishlist(data);
    } catch (err) { /* silent */ }
  };

  useEffect(() => { fetchWishlist(); }, [user]);

  const addToWishlist = async (productId) => {
    if (!user) { toast.error('Please login to add to wishlist'); return; }
    try {
      await addToWishlistAPI(productId);
      await fetchWishlist();
      toast.success('Added to wishlist ❤️');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await removeFromWishlistAPI(productId);
      setWishlist(prev => ({ ...prev, products: prev.products.filter(p => p && p._id !== productId) }));
      toast.success('Removed from wishlist');
    } catch (err) { toast.error('Failed to remove'); }
  };

  const isWishlisted = (productId) => wishlist.products?.some(p => p._id === productId);
  const wishlistCount = wishlist.products?.length || 0;

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistCount, addToWishlist, removeFromWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
