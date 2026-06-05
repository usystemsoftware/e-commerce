const express = require('express');
const router = express.Router();
const { getProducts, getFeaturedProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview, adminGetProducts } = require('../controllers/productController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/review', protect, addReview);
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
