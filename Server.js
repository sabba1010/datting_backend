const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const exampleRoutes = require('./routes/exampleRoutes');
const messageRoutes = require('./routes/messageRoutes');
const planRoutes = require('./routes/planRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // increased for base64

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust this for production
        methods: ['GET', 'POST']
    }
});

// Map to store connected users: userId -> socketId
const onlineUsers = new Map();

io.on('connection', (socket) => {
    // console.log(`User connected: ${socket.id}`);

    // When a user logs in, they send their ID
    socket.on('register', (userId) => {
        onlineUsers.set(userId, socket.id);
        // Broadcast to everyone the new list of online users
        io.emit('online_users', Array.from(onlineUsers.keys()));
    });

    // When someone sends a message, forward it directly to receiver if online
    socket.on('sendMessage', (data) => {
        const { receiverId, message } = data;
        const receiverSocketId = onlineUsers.get(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit('receiveMessage', message);
        }
    });

    socket.on('disconnect', () => {
        // Find which user disconnected
        let disconnectedUser = null;
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                disconnectedUser = userId;
                break;
            }
        }

        if (disconnectedUser) {
            onlineUsers.delete(disconnectedUser);
            io.emit('online_users', Array.from(onlineUsers.keys()));
        }
        // console.log(`User disconnected: ${socket.id}`);
    });
});

// Use Routes
app.use('/api/example', exampleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/plans', planRoutes);

// Test routendpoint
app.get('/', (req, res) => {
    res.send('Backend Server is running...');
});

// Start Server via HTTP server (not Express app)
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
