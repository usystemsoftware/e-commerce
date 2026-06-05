const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price discountPrice stock');
  if (!cart) return res.json({ items: [], totalAmount: 0 });
  res.json(cart);
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (product.stock < quantity) { res.status(400); throw new Error('Insufficient stock'); }

  const price = product.discountPrice > 0 ? product.discountPrice : product.price;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(i => i.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, price });
  }

  cart.calculateTotal();
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product', 'name images price discountPrice stock');
  res.json(populated);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }

  const item = cart.items.find(i => i.product.toString() === productId);
  if (!item) { res.status(404); throw new Error('Item not in cart'); }

  if (quantity <= 0) {
    cart.items = cart.items.filter(i => i.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  cart.calculateTotal();
  await cart.save();
  const populated = await Cart.findById(cart._id).populate('items.product', 'name images price discountPrice stock');
  res.json(populated);
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  cart.calculateTotal();
  await cart.save();
  res.json({ message: 'Item removed', totalAmount: cart.totalAmount });
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalAmount: 0 });
  res.json({ message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
