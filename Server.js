const dotenv = require('dotenv');
// Load environment variables immediately
dotenv.config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const exampleRoutes = require('./routes/exampleRoutes');
const messageRoutes = require('./routes/messageRoutes');
const planRoutes = require('./routes/planRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection & Server Start
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'datingApp',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB Connected (datingApp)... ✅');
        
        // Start Server ONLY after DB connection is successful
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT} 🚀`);
        });
    } catch (err) {
        console.error('MongoDB Connection Error: ❌', err);
        process.exit(1);
    }
};



// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:8080',
        'http://localhost:5000',
        'https://amour-et-sincerite.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5000', 'http://localhost:8080', 'http://localhost:5173', 'https://amour-et-sincerite.com'],
        methods: ['GET', 'POST'],
        credentials: true
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
app.use('/api/payment', paymentRoutes);
app.use('/api/paypal', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seed', require('./routes/seedRoutes'));

// Test routendpoint

app.get('/', (req, res) => {
    res.send('Backend Server is running...');
});

// Initialize DB and start server
connectDB();


