const Message = require('../models/Message');
const User = require('../models/User');

// Send a new message
const sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        const senderId = req.user._id;

        if (!receiverId || !text) {
            return res.status(400).json({ success: false, message: 'Receiver ID and text are required' });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text
        });

        res.status(201).json({ success: true, message: newMessage });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error sending message', error: err.message });
    }
};

// Get all messages between current user and a specific other user
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userId },
                { senderId: userId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }); // Oldest to newest for chronological chat View

        res.json({ success: true, messages });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching messages', error: err.message });
    }
};

// Get a list of all users the current user has chatted with
const getChats = async (req, res) => {
    try {
        const myId = req.user._id;

        // Find all unique users we've exchanged messages with
        const myMessages = await Message.find({
            $or: [{ senderId: myId }, { receiverId: myId }]
        }).sort({ createdAt: -1 }); // Newest first

        const chatMap = new Map();

        for (const msg of myMessages) {
            // Determine who the "other" person is
            const otherUserId = msg.senderId.toString() === myId.toString()
                ? msg.receiverId.toString()
                : msg.senderId.toString();

            if (!chatMap.has(otherUserId)) {
                chatMap.set(otherUserId, msg); // Store the most recent message with them
            }
        }

        // Fetch user profiles for these IDs
        const uniqueOtherUserIds = Array.from(chatMap.keys());
        const usersInfo = await User.find({ _id: { $in: uniqueOtherUserIds } }).select('name photo location');

        const chats = usersInfo.map(user => {
            const lastMsg = chatMap.get(user._id.toString());
            return {
                userId: user._id,
                userName: user.name,
                userPhoto: user.photo,
                userLocation: user.location,
                lastMessage: lastMsg.text,
                lastMessageTime: lastMsg.createdAt
            };
        });

        // Sort chats by most recent message
        chats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        res.json({ success: true, chats });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching chats list', error: err.message });
    }
};

module.exports = { sendMessage, getMessages, getChats };
