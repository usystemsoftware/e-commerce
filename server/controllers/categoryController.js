const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).populate('parentCategory', 'name');
  res.json(categories);
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).populate('parentCategory', 'name').sort({ createdAt: -1 });
  res.json(categories);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentCategory } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  const exists = await Category.findOne({ slug });
  if (exists) { res.status(400); throw new Error('Category already exists'); }
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  const category = await Category.create({ name, slug, description, image, parentCategory: parentCategory || null });
  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) { res.status(404); throw new Error('Category not found'); }
  category.name = req.body.name || category.name;
  category.description = req.body.description || category.description;
  category.isActive = req.body.isActive !== undefined ? req.body.isActive : category.isActive;
  if (req.body.parentCategory !== undefined) category.parentCategory = req.body.parentCategory || null;
  if (req.file) category.image = `/uploads/${req.file.filename}`;
  const updated = await category.save();
  res.json(updated);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) { res.status(404); throw new Error('Category not found'); }
  res.json({ message: 'Category deleted' });
});

module.exports = { getCategories, getAllCategories, createCategory, updateCategory, deleteCategory };
