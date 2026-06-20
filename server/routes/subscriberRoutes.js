const express = require('express');
const router = express.Router();
const {
  subscribe,
  getSubscribers,
  deleteSubscriber,
} = require('../controllers/subscriberController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.route('/')
  .post(subscribe)
  .get(protect, adminOnly, getSubscribers);

router.route('/:id')
  .delete(protect, adminOnly, deleteSubscriber);

module.exports = router;
