const express = require('express');
const router = express.Router();
const { createOrder, captureOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/capture-order', protect, captureOrder);

module.exports = router;
