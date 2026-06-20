const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// @desc  Create Razorpay Order
// @route POST /api/payment/razorpay/order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body; // Local DB order ID
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Convert amount to paisa (smallest unit for INR)
  const amount = Math.round(order.totalAmount * 100);

  const options = {
    amount,
    currency: 'INR',
    receipt: `receipt_${order._id}`,
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    
    // Save razorpayOrderId to the local order
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      key: process.env.RAZORPAY_KEY_ID || 'dummy_key_id'
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500);
    throw new Error('Failed to create Razorpay order');
  }
});

// @desc  Verify Razorpay Payment
// @route POST /api/payment/razorpay/verify
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';
  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paidAt = Date.now();
    await order.save();

    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    order.paymentStatus = 'failed';
    await order.save();
    res.status(400);
    throw new Error('Invalid signature');
  }
});

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
