const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.post('/razorpay/order', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);

module.exports = router;
