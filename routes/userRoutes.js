const express = require('express');
const router = express.Router();
const { updateProfile, getMatches, getMe, likeUser, passUser, getMatchesAndLikes } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);
router.patch('/me', protect, updateProfile);
router.get('/matches', protect, getMatches);
router.get('/affinities', protect, getMatchesAndLikes);
router.post('/like/:id', protect, likeUser);
router.post('/pass/:id', protect, passUser);

module.exports = router;
