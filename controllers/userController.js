const User = require('../models/User');

// Update own profile/setup (called after MatchSetup)
const updateProfile = async (req, res) => {
    try {
        const { gender, lookingFor, ageRange, location, photo, bio, age } = req.body;
        const updates = {};
        if (gender !== undefined) updates.gender = gender;
        if (lookingFor !== undefined) updates.lookingFor = lookingFor;
        if (ageRange !== undefined) updates.ageRange = ageRange;
        if (location !== undefined) updates.location = location;
        if (photo !== undefined) updates.photo = photo;
        if (bio !== undefined) updates.bio = bio;
        if (age !== undefined) updates.age = age;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating profile', error: err.message });
    }
};

// Get real matches from DB
const getMatches = async (req, res) => {
    try {
        const currentUser = req.user;
        if (!currentUser.lookingFor) {
            return res.json({ success: true, count: 0, matches: [] });
        }

        // Parse requested age range
        const ageRange = req.query.ageRange || currentUser.ageRange || '';
        let minAge = 18, maxAge = 100;
        if (ageRange === '18–25' || ageRange === '18-25') { minAge = 18; maxAge = 25; }
        else if (ageRange === '25–35' || ageRange === '25-35') { minAge = 25; maxAge = 35; }
        else if (ageRange === '35–45' || ageRange === '35-45') { minAge = 35; maxAge = 45; }
        else if (ageRange === '45+') { minAge = 45; maxAge = 100; }

        const query = {
            _id: { $ne: currentUser._id },  // exclude self
            gender: currentUser.lookingFor,   // match gender the user is looking for
        };

        if (minAge > 18 || maxAge < 100) {
            query.age = { $gte: minAge, $lte: maxAge };
        }

        const matches = await User.find(query).select('-password');

        // Compute a simple match percentage
        const matchesWithPercent = matches.map(u => {
            let score = 60; // base
            if (u.location && currentUser.location &&
                u.location.toLowerCase() === currentUser.location.toLowerCase()) score += 20;
            if (u.lookingFor === currentUser.gender) score += 20; // they also want you
            return {
                id: u._id,
                name: u.name,
                age: u.age,
                location: u.location,
                gender: u.gender,
                photo: u.photo,
                bio: u.bio,
                matchPercent: Math.min(score, 99),
            };
        });

        // Sort by match percentage desc
        matchesWithPercent.sort((a, b) => b.matchPercent - a.matchPercent);

        res.json({ success: true, count: matchesWithPercent.length, matches: matchesWithPercent });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching matches', error: err.message });
    }
};

// Get current user's profile
const getMe = async (req, res) => {
    res.json({ success: true, user: req.user });
};

module.exports = { updateProfile, getMatches, getMe };
