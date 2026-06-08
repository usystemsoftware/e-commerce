const express = require('express');
const router = express.Router();
const { getActiveBanners, getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Public route to get active banners
router.get('/', getActiveBanners);

// Admin routes
router.get('/all', protect, adminOnly, getAllBanners);
router.post('/', protect, adminOnly, upload.single('image'), createBanner);
router.put('/:id', protect, adminOnly, upload.single('image'), updateBanner);
router.delete('/:id', protect, adminOnly, deleteBanner);

module.exports = router;
