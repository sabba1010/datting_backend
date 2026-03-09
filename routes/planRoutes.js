const express = require('express');
const router = express.Router();
const { getPlans, subscribe } = require('../controllers/planController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPlans);
router.post('/subscribe', protect, subscribe);

module.exports = router;
