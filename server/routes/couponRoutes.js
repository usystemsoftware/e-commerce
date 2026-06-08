const express = require('express');
const router = express.Router();
const { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/validate', protect, validateCoupon);

router.route('/')
  .get(protect, adminOnly, getAllCoupons)
  .post(protect, adminOnly, createCoupon);

router.route('/:id')
  .put(protect, adminOnly, updateCoupon)
  .delete(protect, adminOnly, deleteCoupon);

module.exports = router;
