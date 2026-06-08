const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc  Place new order
// @route POST /api/orders
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, couponCode } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400); throw new Error('Cart is empty');
  }

  // Check stock
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${item.product.name}`);
    }
  }

  const itemsPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  
  let discountAmount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon && coupon.isActive && new Date(coupon.expiryDate) >= new Date() && (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit)) {
      if (coupon.discountType === 'percentage') {
        discountAmount = (itemsPrice * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }
      coupon.usedCount += 1;
      await coupon.save();
    }
  }

  const shippingPrice = itemsPrice > 499 ? 0 : 49;
  const taxPrice = parseFloat((0.05 * (itemsPrice - discountAmount)).toFixed(2));
  const totalAmount = parseFloat((itemsPrice - discountAmount + shippingPrice + taxPrice).toFixed(2));

  const orderItems = cart.items.map(i => ({
    product: i.product._id,
    name: i.product.name,
    image: i.product.images[0] || '',
    price: i.price,
    quantity: i.quantity,
  }));

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
    itemsPrice,
    shippingPrice,
    taxPrice,
    couponCode: couponCode || '',
    discountAmount,
    totalAmount,
    paidAt: paymentMethod !== 'COD' ? new Date() : null,
  });

  // Reduce stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalAmount: 0 });

  res.status(201).json(order);
});

// @desc  Get my orders
// @route GET /api/orders/my-orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc  Get order by ID
// @route GET /api/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json(order);
});

// @desc  Cancel order
// @route PUT /api/orders/:id/cancel
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorized'); }
  if (['shipped', 'delivered'].includes(order.orderStatus)) {
    res.status(400); throw new Error('Cannot cancel order that has been shipped or delivered');
  }
  order.orderStatus = 'cancelled';
  order.cancelReason = req.body.reason || 'Cancelled by user';
  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }
  await order.save();
  res.json({ message: 'Order cancelled', order });
});

// ---- ADMIN ----

// @desc  Get all orders (admin)
// @route GET /api/admin/orders
const adminGetOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 20;
  const statusFilter = req.query.status ? { orderStatus: req.query.status } : {};
  const count = await Order.countDocuments(statusFilter);
  const orders = await Order.find(statusFilter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ orders, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc  Update order status (admin)
// @route PUT /api/admin/orders/:id/status
const adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.orderStatus = req.body.orderStatus || order.orderStatus;
  if (req.body.orderStatus === 'delivered') {
    order.deliveredAt = new Date();
    order.paymentStatus = 'paid';
  }
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
  await order.save();
  res.json(order);
});

module.exports = { placeOrder, getMyOrders, getOrderById, cancelOrder, adminGetOrders, adminUpdateOrderStatus };
