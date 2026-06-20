const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById, cancelOrder, requestReturn } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);
router.post('/', placeOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/return', requestReturn);

module.exports = router;
