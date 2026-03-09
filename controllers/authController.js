const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register
const register = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already in use.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Assign default Free plan
        const Plan = require('../models/Plan');
        const freePlan = await Plan.findOne({ name: 'Free Registration' });

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            plan: freePlan ? freePlan._id : null,
            subscriptionStatus: freePlan ? 'active' : 'none'
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                lookingFor: user.lookingFor,
                photo: user.photo,
                age: user.age,
                location: user.location,
                ageRange: user.ageRange,
                plan: user.plan,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Registration error', error: err.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Logged in successfully!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                lookingFor: user.lookingFor,
                photo: user.photo,
                age: user.age,
                location: user.location,
                ageRange: user.ageRange,
                plan: user.plan,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Login error', error: err.message });
    }
};

module.exports = { register, login };
