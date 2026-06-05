const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name images price discountPrice ratings stock isActive');
  if (!wishlist) return res.json({ products: [] });
  res.json(wishlist);
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, products: [] });
  }
  if (wishlist.products.includes(productId)) {
    return res.status(400).json({ message: 'Product already in wishlist' });
  }
  wishlist.products.push(productId);
  await wishlist.save();
  res.status(201).json({ message: 'Added to wishlist' });
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) { res.status(404); throw new Error('Wishlist not found'); }
  wishlist.products = wishlist.products.filter(p => p.toString() !== req.params.productId);
  await wishlist.save();
  res.json({ message: 'Removed from wishlist' });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
