const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

// @desc  Dashboard statistics
// @route GET /api/admin/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalProducts = await Product.countDocuments({ isActive: true });
  const totalOrders = await Order.countDocuments();
  const totalCategories = await Category.countDocuments({ isActive: true });

  const revenueResult = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  const lowStockProducts = await Product.find({ stock: { $lte: 10 }, isActive: true })
    .select('name stock images')
    .limit(5);

  // Monthly revenue for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlyRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, orderStatus: { $ne: 'cancelled' } } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
  ]);

  res.json({
    totalUsers, totalProducts, totalOrders, totalCategories, totalRevenue,
    recentOrders, lowStockProducts, monthlyRevenue, ordersByStatus,
  });
});

// @desc  Get all users
// @route GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = 20;
  const keyword = req.query.keyword
    ? { $or: [{ name: { $regex: req.query.keyword, $options: 'i' } }, { email: { $regex: req.query.keyword, $options: 'i' } }] }
    : {};
  const count = await User.countDocuments({ role: 'user', ...keyword });
  const users = await User.find({ role: 'user', ...keyword })
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ users, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc  Toggle block/unblock user
// @route PUT /api/admin/users/:id
const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.isBlocked = req.body.isBlocked !== undefined ? req.body.isBlocked : user.isBlocked;
  user.role = req.body.role || user.role;
  await user.save();
  res.json({ message: 'User updated', user: { _id: user._id, name: user.name, email: user.email, isBlocked: user.isBlocked, role: user.role } });
});

// @desc  Delete user
// @route DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ message: 'User deleted' });
});

// @desc  Get low stock products
// @route GET /api/admin/stock
const getStockReport = asyncHandler(async (req, res) => {
  const threshold = Number(req.query.threshold) || 10;
  const products = await Product.find({ stock: { $lte: threshold } })
    .populate('category', 'name')
    .select('name stock price category images isActive')
    .sort({ stock: 1 });
  res.json(products);
});

// @desc  Update product stock
// @route PUT /api/admin/stock/:productId
const updateStock = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    { stock: req.body.stock },
    { new: true }
  );
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ message: 'Stock updated', stock: product.stock });
});

module.exports = { getDashboardStats, getAllUsers, updateUserStatus, deleteUser, getStockReport, updateStock };
