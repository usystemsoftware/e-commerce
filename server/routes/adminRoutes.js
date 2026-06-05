const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUserStatus, deleteUser, getStockReport, updateStock } = require('../controllers/adminController');
const { adminGetOrders, adminUpdateOrderStatus } = require('../controllers/orderController');
const { adminGetProducts } = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/orders', adminGetOrders);
router.put('/orders/:id/status', adminUpdateOrderStatus);
router.get('/products', adminGetProducts);
router.get('/stock', getStockReport);
router.put('/stock/:productId', updateStock);

module.exports = router;
