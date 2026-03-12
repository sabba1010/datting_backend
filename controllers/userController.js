const User = require('../models/User');

// Update own profile/setup (called after MatchSetup)
const updateProfile = async (req, res) => {
    try {
        const { name, gender, lookingFor, ageRange, location, photo, photos, bio, age } = req.body;
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (gender !== undefined) updates.gender = gender;
        if (lookingFor !== undefined) updates.lookingFor = lookingFor;
        if (ageRange !== undefined) updates.ageRange = ageRange;
        if (location !== undefined) updates.location = location;
        if (photo !== undefined) updates.photo = photo;
        if (photos !== undefined) updates.photos = photos;
        if (bio !== undefined) updates.bio = bio;
        if (age !== undefined) updates.age = age;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');

        // Return consistent user object
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            lookingFor: user.lookingFor,
            photo: user.photo,
            photos: user.photos || [],
            age: user.age,
            location: user.location,
            ageRange: user.ageRange,
        };
        res.json({ success: true, user: userResponse });
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

        // Parse requested age range robustly using regex to avoid encoding issues with dashes
        const ageRangeStr = req.query.ageRange || currentUser.ageRange || '';
        let minAge = 18, maxAge = 100;

        const ageMatches = ageRangeStr.match(/(\d+)\D+(\d+)?/);
        if (ageMatches) {
            minAge = parseInt(ageMatches[1], 10);
            if (ageMatches[2]) {
                maxAge = parseInt(ageMatches[2], 10);
            } else if (ageRangeStr.includes('+')) {
                maxAge = 100; // Case for "45+"
            }
        }

        const query = {
            _id: { $ne: currentUser._id }, // exclude self
        };

        // Filter by gender the current user is looking for
        if (currentUser.lookingFor !== 'everyone') {
            query.gender = currentUser.lookingFor;
        }

        // BI-DIRECTIONAL MATCHING:
        // Only show users who are looking for the current user's gender OR everyone
        if (currentUser.gender) {
            query.$or = [
                { lookingFor: currentUser.gender },
                { lookingFor: 'everyone' },
                { lookingFor: '' }, // handle legacy/unset
                { lookingFor: { $exists: false } }
            ];
        }

        if (minAge > 18 || maxAge < 100) {
            const ageQuery = {
                $or: [
                    { age: { $gte: minAge, $lte: maxAge } },
                    { age: null },
                    { age: { $exists: false } }
                ]
            };

            // Merge ageQuery with the existing query
            if (query.$or) {
                // If query already has $or, we use $and to join them
                const originalOr = query.$or;
                delete query.$or;
                query.$and = [
                    { $or: originalOr },
                    ageQuery
                ];
            } else {
                query.$or = ageQuery.$or;
            }
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
                photos: u.photos || [],
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
