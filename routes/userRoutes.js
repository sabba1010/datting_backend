const express = require('express');
const router = express.Router();
const { registerUser, getMatches } = require('../controllers/userController');

// Registration route
router.post('/register', registerUser);

// Matching route
router.get('/matches', getMatches);

module.exports = router;
