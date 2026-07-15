const asyncHandler = require('express-async-handler');
const Contact = require('../models/Contact');

// @desc    Submit a contact query
// @route   POST /api/contact
// @access  Public
const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  if (contact) {
    res.status(201).json({ message: 'Message sent successfully' });
  } else {
    res.status(400);
    throw new Error('Invalid query data');
  }
});

// @desc    Get all contact queries
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  res.json(contacts);
});

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    contact.status = status;
    const updatedContact = await contact.save();
    res.json(updatedContact);
  } else {
    res.status(404);
    throw new Error('Contact query not found');
  }
});

// @desc    Delete contact query
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (contact) {
    await contact.deleteOne();
    res.json({ message: 'Query removed' });
  } else {
    res.status(404);
    throw new Error('Contact query not found');
  }
});

module.exports = {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact,
};
