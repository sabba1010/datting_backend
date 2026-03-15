const express = require('express');
const router = express.Router();
const { 
    updateProfile, getMatches, getMe, likeUser, passUser, 
    getMatchesAndLikes, getPublicProfile, getProfileVisitors, 
    superLikeUser, blockUser 
} = require('../controllers/userController');
const { reportUser } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);
router.patch('/me', protect, updateProfile);
router.get('/matches', protect, getMatches);
router.get('/affinities', protect, getMatchesAndLikes);
router.get('/visitors', protect, getProfileVisitors);
router.get('/profile/:id', protect, getPublicProfile);
router.post('/like/:id', protect, likeUser);
router.post('/superlike/:id', protect, superLikeUser);
router.post('/pass/:id', protect, passUser);
router.post('/block/:id', protect, blockUser);
router.post('/report', protect, reportUser);

module.exports = router;
