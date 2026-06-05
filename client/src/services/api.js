import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerAPI = (data) => API.post('/auth/register', data);
export const loginAPI = (data) => API.post('/auth/login', data);
export const adminLoginAPI = (data) => API.post('/auth/admin/login', data);
export const getMeAPI = () => API.get('/auth/me');
export const updateProfileAPI = (data) => API.put('/auth/update-profile', data);
export const changePasswordAPI = (data) => API.put('/auth/change-password', data);
export const addAddressAPI = (data) => API.post('/auth/addresses', data);
export const deleteAddressAPI = (id) => API.delete(`/auth/addresses/${id}`);

// Products
export const getProductsAPI = (params) => API.get('/products', { params });
export const getFeaturedProductsAPI = () => API.get('/products/featured');
export const getProductByIdAPI = (id) => API.get(`/products/${id}`);
export const addReviewAPI = (id, data) => API.post(`/products/${id}/review`, data);
export const createProductAPI = (data) => API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProductAPI = (id, data) => API.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProductAPI = (id) => API.delete(`/products/${id}`);
export const adminGetProductsAPI = () => API.get('/admin/products');

// Categories
export const getCategoriesAPI = () => API.get('/categories');
export const getAllCategoriesAPI = () => API.get('/categories/all');
export const createCategoryAPI = (data) => API.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateCategoryAPI = (id, data) => API.put(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteCategoryAPI = (id) => API.delete(`/categories/${id}`);

// Cart
export const getCartAPI = () => API.get('/cart');
export const addToCartAPI = (data) => API.post('/cart/add', data);
export const updateCartAPI = (data) => API.put('/cart/update', data);
export const removeFromCartAPI = (productId) => API.delete(`/cart/remove/${productId}`);
export const clearCartAPI = () => API.delete('/cart/clear');

// Wishlist
export const getWishlistAPI = () => API.get('/wishlist');
export const addToWishlistAPI = (productId) => API.post('/wishlist/add', { productId });
export const removeFromWishlistAPI = (productId) => API.delete(`/wishlist/remove/${productId}`);

// Orders
export const placeOrderAPI = (data) => API.post('/orders', data);
export const getMyOrdersAPI = () => API.get('/orders/my-orders');
export const getOrderByIdAPI = (id) => API.get(`/orders/${id}`);
export const cancelOrderAPI = (id, reason) => API.put(`/orders/${id}/cancel`, { reason });

// Admin
export const getDashboardStatsAPI = () => API.get('/admin/dashboard');
export const getAllUsersAPI = (params) => API.get('/admin/users', { params });
export const updateUserStatusAPI = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteUserAPI = (id) => API.delete(`/admin/users/${id}`);
export const adminGetOrdersAPI = (params) => API.get('/admin/orders', { params });
export const adminUpdateOrderStatusAPI = (id, data) => API.put(`/admin/orders/${id}/status`, data);
export const getStockReportAPI = (threshold) => API.get('/admin/stock', { params: { threshold } });
export const updateStockAPI = (productId, stock) => API.put(`/admin/stock/${productId}`, { stock });

export default API;
