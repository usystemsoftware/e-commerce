import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SettingsProvider } from './context/SettingsContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute/ProtectedRoute';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// User Pages
import Home from './pages/user/Home';
import ProductListing from './pages/user/ProductListing';
import ProductDetails from './pages/user/ProductDetails';
import Cart from './pages/user/Cart';
import Wishlist from './pages/user/Wishlist';
import Checkout from './pages/user/Checkout';
import MyOrders from './pages/user/MyOrders';
import OrderDetail from './pages/user/OrderDetail';
import Profile from './pages/user/Profile';
import DynamicPage from './pages/user/DynamicPage';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/ManageCategories';
import StockManagement from './pages/admin/StockManagement';
import ManageSettings from './pages/admin/ManageSettings';
import ManageBanners from './pages/admin/ManageBanners';
import ManageCoupons from './pages/admin/ManageCoupons';
import ManagePages from './pages/admin/ManagePages';

// Layout for user-facing pages (with navbar + footer)
const UserLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <WishlistProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              theme="dark"
              toastStyle={{ background: 'var(--dark-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'Outfit' }}
            />
            <Routes>
              {/* ===== PUBLIC AUTH ROUTES ===== */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* ===== USER ROUTES (with Navbar + Footer) ===== */}
              <Route path="/" element={<UserLayout><Home /></UserLayout>} />
              <Route path="/products" element={<UserLayout><ProductListing /></UserLayout>} />
              <Route path="/products/:id" element={<UserLayout><ProductDetails /></UserLayout>} />
              <Route path="/page/:slug" element={<UserLayout><DynamicPage /></UserLayout>} />

              <Route path="/cart" element={
                <ProtectedRoute>
                  <UserLayout><Cart /></UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <UserLayout><Wishlist /></UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <UserLayout><Checkout /></UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <UserLayout><MyOrders /></UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/orders/:id" element={
                <ProtectedRoute>
                  <UserLayout><OrderDetail /></UserLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserLayout><Profile /></UserLayout>
                </ProtectedRoute>
              } />

              {/* ===== ADMIN ROUTES (with AdminLayout inside each page) ===== */}
              <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><Products /></AdminRoute>} />
              <Route path="/admin/products/add" element={<AdminRoute><AddProduct /></AdminRoute>} />
              <Route path="/admin/products/edit/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
              <Route path="/admin/stock" element={<AdminRoute><StockManagement /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><ManageSettings /></AdminRoute>} />
              <Route path="/admin/banners" element={<AdminRoute><ManageBanners /></AdminRoute>} />
              <Route path="/admin/coupons" element={<AdminRoute><ManageCoupons /></AdminRoute>} />
              <Route path="/admin/pages" element={<AdminRoute><ManagePages /></AdminRoute>} />

              {/* 404 */}
              <Route path="*" element={
                <UserLayout>
                  <div className="container py-5">
                    <div className="empty-state">
                      <i className="bi bi-emoji-dizzy"></i>
                      <h3>404 — Page Not Found</h3>
                      <p>The page you're looking for doesn't exist.</p>
                      <a href="/" className="btn-primary-custom">Go Home</a>
                    </div>
                  </div>
                </UserLayout>
              } />
            </Routes>
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
