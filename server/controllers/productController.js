const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc  Get all products with search, filter, sort, pagination
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const categoryFilter = req.query.category ? { category: req.query.category } : {};
  const brandFilter = req.query.brand ? { brand: { $regex: req.query.brand, $options: 'i' } } : {};

  const priceFilter =
    req.query.minPrice || req.query.maxPrice
      ? {
          price: {
            ...(req.query.minPrice && { $gte: Number(req.query.minPrice) }),
            ...(req.query.maxPrice && { $lte: Number(req.query.maxPrice) }),
          },
        }
      : {};

  const ratingFilter = req.query.rating ? { ratings: { $gte: Number(req.query.rating) } } : {};

  const filter = {
    isActive: true,
    ...keyword,
    ...categoryFilter,
    ...brandFilter,
    ...priceFilter,
    ...ratingFilter,
  };

  const sortOptions = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { ratings: -1 },
    popular: { numReviews: -1 },
  };
  const sort = sortOptions[req.query.sort] || { createdAt: -1 };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc  Get featured products
// @route GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .limit(8);
  res.json(products);
});

// @desc  Get single product
// @route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug').populate('reviews.user', 'name avatar');
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
});

// @desc  Create product (Admin)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discountPrice, category, brand, stock, isFeatured, tags } = req.body;
  const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

  const product = await Product.create({
    name, description, price, discountPrice, category, brand, stock, isFeatured, tags,
    images,
  });
  res.status(201).json(product);
});

// @desc  Update product (Admin)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const fields = ['name', 'description', 'price', 'discountPrice', 'category', 'brand', 'stock', 'isFeatured', 'isActive', 'tags'];
  fields.forEach(f => { if (req.body[f] !== undefined) product[f] = req.body[f]; });

  if (req.files && req.files.length > 0) {
    product.images = req.files.map(f => `/uploads/${f.filename}`);
  }

  const updated = await product.save();
  res.json(updated);
});

// @desc  Delete product (Admin)
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ message: 'Product deleted successfully' });
});

// @desc  Add review
// @route POST /api/products/:id/review
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) { res.status(400); throw new Error('You have already reviewed this product'); }

  product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: 'Review added' });
});

// @desc  Get all products for admin (including inactive)
// @route GET /api/admin/products
const adminGetProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate('category', 'name').sort({ createdAt: -1 });
  res.json(products);
});

module.exports = { getProducts, getFeaturedProducts, getProductById, createProduct, updateProduct, deleteProduct, addReview, adminGetProducts };
