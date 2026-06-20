const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.route('/')
  .post(submitContact)
  .get(protect, adminOnly, getContacts);

router.route('/:id/status')
  .put(protect, adminOnly, updateContactStatus);

router.route('/:id')
  .delete(protect, adminOnly, deleteContact);

module.exports = router;
