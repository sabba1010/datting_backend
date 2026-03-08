const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getChats } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Base route: /api/messages

// Get list of recent chats
router.get('/chats', protect, getChats);

// Get messages for a specific conversation
router.get('/:userId', protect, getMessages);

// Send a message
router.post('/', protect, sendMessage);

module.exports = router;
