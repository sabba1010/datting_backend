const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, age, location, gender, photo, bio } = req.body;

        const newUser = new User({
            name,
            age,
            location,
            gender,
            photo,
            bio
        });

        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            user: newUser
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: 'Error registering user',
            error: err.message
        });
    }
};

// Get matching users (e.g., opposite gender)
const getMatches = async (req, res) => {
    try {
        const { gender } = req.query;
        let query = {};

        if (gender) {
            // If gender is provided, find the opposite
            const oppositeGender = gender === 'man' ? 'woman' : 'man';
            query.gender = oppositeGender;
        }

        const matches = await User.find(query);
        res.json({
            success: true,
            count: matches.length,
            matches
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching matches',
            error: err.message
        });
    }
};

module.exports = {
    registerUser,
    getMatches
};
