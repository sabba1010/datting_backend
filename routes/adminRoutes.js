const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser, toggleSuspendUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/suspend', protect, admin, toggleSuspendUser);

module.exports = router;
