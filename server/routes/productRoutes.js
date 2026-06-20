const express = require('express');
const router = express.Router();
const { getProducts, getFeaturedProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview, adminGetProducts, adminGetReviews, adminDeleteReview } = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/featured', getFeaturedProducts);
router.get('/admin/reviews', protect, adminOnly, adminGetReviews);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/review', protect, addReview);
router.delete('/:productId/reviews/:reviewId', protect, adminOnly, adminDeleteReview);
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
