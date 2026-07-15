import { createContext, useContext, useState, useEffect } from 'react';
import { getCartAPI, addToCartAPI, updateCartAPI, removeFromCartAPI, clearCartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user || user.role === 'admin') return;
    try {
      const { data } = await getCartAPI();
      setCart(data);
    } catch (err) { /* silent */ }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add to cart'); return; }
    try {
      setLoading(true);
      const { data } = await addToCartAPI({ productId, quantity });
      setCart(data);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally { setLoading(false); }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await updateCartAPI({ productId, quantity });
      setCart(data);
    } catch (err) { toast.error('Failed to update'); }
  };

  const removeFromCart = async (productId) => {
    try {
      await removeFromCartAPI(productId);
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(i => i.product._id !== productId),
        totalAmount: prev.items.filter(i => i.product._id !== productId).reduce((a, i) => a + i.price * i.quantity, 0),
      }));
      toast.success('Removed from cart');
    } catch (err) { toast.error('Failed to remove'); }
  };

  const clearCart = async () => {
    try {
      await clearCartAPI();
      setCart({ items: [], totalAmount: 0 });
    } catch (err) { /* silent */ }
  };

  const cartCount = cart.items?.reduce((a, i) => a + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, cartCount, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
