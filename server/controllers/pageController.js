const Page = require('../models/Page');

// @desc    Get all pages
// @route   GET /api/pages
// @access  Public
const getPages = async (req, res) => {
  try {
    const pages = await Page.find({ isActive: true }).select('title slug');
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pages', error: error.message });
  }
};

// @desc    Get page by slug
// @route   GET /api/pages/:slug
// @access  Public
const getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isActive: true });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch page', error: error.message });
  }
};

// @desc    Get all pages (Admin)
// @route   GET /api/pages/all
// @access  Private/Admin
const getAllPages = async (req, res) => {
  try {
    const pages = await Page.find().sort('-createdAt');
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pages', error: error.message });
  }
};

// @desc    Create a page
// @route   POST /api/pages
// @access  Private/Admin
const createPage = async (req, res) => {
  try {
    const exists = await Page.findOne({ slug: req.body.slug });
    if (exists) return res.status(400).json({ message: 'Page slug already exists' });

    const page = await Page.create(req.body);
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create page', error: error.message });
  }
};

// @desc    Update a page
// @route   PUT /api/pages/:id
// @access  Private/Admin
const updatePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    // Ensure slug uniqueness if changed
    if (req.body.slug && req.body.slug !== page.slug) {
      const exists = await Page.findOne({ slug: req.body.slug });
      if (exists) return res.status(400).json({ message: 'Page slug already exists' });
    }

    Object.assign(page, req.body);
    const updated = await page.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update page', error: error.message });
  }
};

// @desc    Delete a page
// @route   DELETE /api/pages/:id
// @access  Private/Admin
const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    await page.deleteOne();
    res.json({ message: 'Page removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete page', error: error.message });
  }
};

module.exports = {
  getPages,
  getPageBySlug,
  getAllPages,
  createPage,
  updatePage,
  deletePage,
};
