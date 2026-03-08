const express = require('express');
const router = express.Router();
const { updateProfile, getMatches, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);
router.patch('/me', protect, updateProfile);
router.get('/matches', protect, getMatches);

module.exports = router;
