const express = require('express');
const router = express.Router();
const { getPages, getPageBySlug, getAllPages, createPage, updatePage, deletePage } = require('../controllers/pageController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Admin routes (MUST be before /:slug)
router.get('/all', protect, adminOnly, getAllPages);
router.post('/', protect, adminOnly, createPage);
router.put('/:id', protect, adminOnly, updatePage);
router.delete('/:id', protect, adminOnly, deletePage);

// Public routes
router.get('/', getPages);
router.get('/:slug', getPageBySlug);

module.exports = router;
