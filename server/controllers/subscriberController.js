const asyncHandler = require('express-async-handler');
const Subscriber = require('../models/Subscriber');

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email');
  }

  const subscriberExists = await Subscriber.findOne({ email });

  if (subscriberExists) {
    res.status(400);
    throw new Error('Email already subscribed');
  }

  const subscriber = await Subscriber.create({ email });

  if (subscriber) {
    res.status(201).json({ message: 'Subscribed successfully' });
  } else {
    res.status(400);
    throw new Error('Invalid email data');
  }
});

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private/Admin
const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
  res.json(subscribers);
});

// @desc    Delete a subscriber
// @route   DELETE /api/subscribers/:id
// @access  Private/Admin
const deleteSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await Subscriber.findById(req.params.id);

  if (subscriber) {
    await subscriber.deleteOne();
    res.json({ message: 'Subscriber removed' });
  } else {
    res.status(404);
    throw new Error('Subscriber not found');
  }
});

module.exports = {
  subscribe,
  getSubscribers,
  deleteSubscriber,
};
