const User = require('../models/User');

// Update own profile/setup (called after MatchSetup)
const updateProfile = async (req, res) => {
    try {
        console.log(`[UpdateProfile] Updating user ${req.user._id}...`);
        const { 
            name, gender, lookingFor, ageRange, location, photo, photos, bio, age,
            hobbies, favoriteActivities, zodiacSign, religion, children,
            height, weight, eyeColor, hairColor, smoke, alcohol,
            locationCoords, country, department, city
        } = req.body;

        const updates = {};
        // ... (rest of the logic remains same, but we add a check for the object)
        if (req.body === undefined) {
             return res.status(400).json({ success: false, message: 'Corps de la requête manquant' });
        }

        if (name !== undefined) updates.name = name;
        if (gender !== undefined) updates.gender = gender;
        if (lookingFor !== undefined) updates.lookingFor = lookingFor;
        if (ageRange !== undefined) updates.ageRange = ageRange;
        if (location !== undefined) updates.location = location;
        if (photo !== undefined) updates.photo = photo;
        if (photos !== undefined) updates.photos = photos;
        if (bio !== undefined) updates.bio = bio;
        if (age !== undefined) updates.age = age;
        
        // Detailed fields
        if (hobbies !== undefined) updates.hobbies = hobbies;
        if (favoriteActivities !== undefined) updates.favoriteActivities = favoriteActivities;
        if (zodiacSign !== undefined) updates.zodiacSign = zodiacSign;
        if (religion !== undefined) updates.religion = religion;
        if (children !== undefined) updates.children = children;
        if (height !== undefined) updates.height = height;
        if (weight !== undefined) updates.weight = weight;
        if (eyeColor !== undefined) updates.eyeColor = eyeColor;
        if (hairColor !== undefined) updates.hairColor = hairColor;
        if (smoke !== undefined) updates.smoke = smoke;
        if (alcohol !== undefined) updates.alcohol = alcohol;

        // Location fields
        if (locationCoords !== undefined) updates.locationCoords = locationCoords;
        if (country !== undefined) updates.country = country;
        if (department !== undefined) updates.department = department;
        if (city !== undefined) updates.city = city;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');

        if (!user) {
            console.error(`[UpdateProfile] User ${req.user._id} not found during update`);
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
        }

        console.log(`[UpdateProfile] Successfully updated user ${req.user._id}`);
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
            hobbies: user.hobbies,
            favoriteActivities: user.favoriteActivities,
            zodiacSign: user.zodiacSign,
            religion: user.religion,
            children: user.children,
            height: user.height,
            weight: user.weight,
            eyeColor: user.eyeColor,
            hairColor: user.hairColor,
            smoke: user.smoke,
            alcohol: user.alcohol,
            locationCoords: user.locationCoords,
            country: user.country,
            department: user.department,
            city: user.city
        };
        res.json({ success: true, user: userResponse });
    } catch (err) {
        console.error(`[UpdateProfile] Error: ${err.message}`, err);
        res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du profil', error: err.message });
    }
};

// Get real matches from DB
const getMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const { 
            radius, lat, lng, searchLevel, filterCountry, filterDept,
            smoke, alcohol, children, religion, zodiacSign, minHeight, maxHeight
        } = req.query;

        // Exclude users already liked, passed or already matched
        const seenUsers = [
            req.user._id,
            ...(currentUser.likes || []),
            ...(currentUser.passed || []),
            ...(currentUser.matches || [])
        ];

        let query = {
            _id: { $nin: seenUsers },
        };

        // Advanced Filters
        if (smoke) query.smoke = smoke;
        if (alcohol) query.alcohol = alcohol;
        if (children) query.children = children;
        if (religion) query.religion = religion;
        if (zodiacSign) query.zodiacSign = zodiacSign;
        
        if (minHeight || maxHeight) {
            query.height = {};
            if (minHeight) query.height.$gte = minHeight;
            if (maxHeight) query.height.$lte = maxHeight;
        }

        // Gender matching
        if (currentUser.lookingFor === 'man') query.gender = 'man';
        else if (currentUser.lookingFor === 'woman') query.gender = 'woman';

        // Geospatial search
        if (radius && lat && lng) {
            query.locationCoords = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius) * 1000 // km to meters
                }
            };
        } else if (searchLevel === 'country' && (filterCountry || currentUser.country)) {
            query.country = filterCountry || currentUser.country;
        } else if (searchLevel === 'department' && (filterDept || currentUser.department)) {
            query.department = filterDept || currentUser.department;
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

        // 1. FILTER: Basic gender preference (who YOU want)
        if (currentUser.lookingFor !== 'everyone') {
            query.gender = currentUser.lookingFor;
        }

        // 2. FILTER: Bidirectional gender preference (they must WANT YOU too)
        // Only show users who are looking for the current user's gender OR everyone
        const bidirectionalGenderQuery = {
            $or: [
                { lookingFor: currentUser.gender },
                { lookingFor: 'everyone' },
                { lookingFor: '' }, 
                { lookingFor: { $exists: false } }
            ]
        };

        // 3. FILTER: Age range you want
        const ageRangeQuery = {
            $or: [
                { age: { $gte: minAge, $lte: maxAge } },
                { age: null },
                { age: { $exists: false } }
            ]
        };

        // 4. FILTER: (PERFECT MATCHING) They must want YOUR age as well
        // We look at the user's age and check if it fits in their ageRange preference
        // This is tricky because ageRange is a string like "25-35". 
        // For simplicity, we skip strict backend filter for this to avoid complex regex in MongoDB query,
        // but it's better to do it. Let's try a simpler approach: check ageRange string directly if possible,
        // but users might have different formats. Let's stick to gender and age filters for now and refine score.

        query.$and = [
            bidirectionalGenderQuery,
            ageRangeQuery
        ];

        const matches = await User.find(query).select('-password');

        // Improved Match Percentage Calculation (The "Perfect" Algorithm)
        const matchesWithPercent = matches.map(u => {
            let score = 50; // base score for qualifying filters
            
            // Location Bonus (Max +15)
            if (u.city && currentUser.city && u.city.toLowerCase() === currentUser.city.toLowerCase()) {
                score += 15;
            } else if (u.department && currentUser.department && u.department.toLowerCase() === currentUser.department.toLowerCase()) {
                score += 10;
            } else if (u.location && currentUser.location && u.location.toLowerCase() === currentUser.location.toLowerCase()) {
                score += 5;
            }

            // Bidirectional Gender Bonus (+10)
            if (u.lookingFor === currentUser.gender) score += 10;

            // Interest/Hobbies Match (Max +15)
            if (u.hobbies && currentUser.hobbies) {
                const uHobbies = u.hobbies.toLowerCase().split(/[ ,]+/).filter(h => h.length > 2);
                const cHobbies = currentUser.hobbies.toLowerCase().split(/[ ,]+/).filter(h => h.length > 2);
                const intersection = uHobbies.filter(h => cHobbies.includes(h));
                if (intersection.length > 0) score += Math.min(intersection.length * 5, 15);
            }

            // Lifestyle Match (Max +10)
            if (u.smoke === currentUser.smoke && u.smoke) score += 5;
            if (u.alcohol === currentUser.alcohol && u.alcohol) score += 5;

            // Traits Match (Max +10)
            if (u.zodiacSign === currentUser.zodiacSign && u.zodiacSign) score += 5;
            if (u.religion === currentUser.religion && u.religion) score += 5;

            // Cap the score
            return {
                id: u._id,
                name: u.name,
                age: u.age,
                location: u.location,
                gender: u.gender,
                photo: u.photo,
                photos: u.photos || [],
                bio: u.bio,
                hobbies: u.hobbies,
                favoriteActivities: u.favoriteActivities,
                zodiacSign: u.zodiacSign,
                religion: u.religion,
                children: u.children,
                height: u.height,
                weight: u.weight,
                eyeColor: u.eyeColor,
                hairColor: u.hairColor,
                smoke: u.smoke,
                alcohol: u.alcohol,
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

// Like a user
const likeUser = async (req, res) => {
    try {
        const targetId = req.params.id;
        const currentUserId = req.user._id;

        if (targetId === currentUserId.toString()) {
            return res.status(400).json({ success: false, message: "Vous ne pouvez pas vous liker vous-même." });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetId);

        if (!targetUser) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
        }

        // Already liked?
        if (currentUser.likes.includes(targetId)) {
            return res.json({ success: true, message: "Déjà liké." });
        }

        // Add to likes
        currentUser.likes.push(targetId);
        targetUser.likedBy.push(currentUserId);

        // Check for match
        let isMatch = false;
        if (targetUser.likes.includes(currentUserId)) {
            isMatch = true;
            currentUser.matches.push(targetId);
            targetUser.matches.push(currentUserId);
            // In a real app, trigger notification/socket event here
        }

        await currentUser.save();
        await targetUser.save();

        res.json({ 
            success: true, 
            isMatch, 
            message: isMatch ? "C'est un match !" : "Profil liké." 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erreur lors du like", error: err.message });
    }
};

// Pass a user
const passUser = async (req, res) => {
    try {
        const targetId = req.params.id;
        const currentUser = await User.findById(req.user._id);

        if (!currentUser.passed.includes(targetId)) {
            currentUser.passed.push(targetId);
            await currentUser.save();
        }

        res.json({ success: true, message: "Profil ignoré." });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erreur lors du pass", error: err.message });
    }
};

// Get mutual matches and people who liked me
const getMatchesAndLikes = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('matches', 'name photo bio age location gender')
            .populate('likedBy', 'name photo bio age location gender')
            .populate('likes', 'name photo bio age location gender');

        res.json({
            success: true,
            matches: user.matches,
            likedBy: user.likedBy,
            likesSent: user.likes
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des affinités", error: err.message });
    }
};

// Get a specific user's public profile by ID
const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        const publicData = {
            id: user._id,
            name: user.name,
            age: user.age,
            location: user.location,
            gender: user.gender,
            photo: user.photo,
            photos: user.photos || [],
            bio: user.bio,
            hobbies: user.hobbies,
            favoriteActivities: user.favoriteActivities,
            zodiacSign: user.zodiacSign,
            religion: user.religion,
            children: user.children,
            height: user.height,
            weight: user.weight,
            eyeColor: user.eyeColor,
            hairColor: user.hairColor,
            smoke: user.smoke,
            alcohol: user.alcohol,
        };

        res.json({ success: true, user: publicData });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erreur lors de la récupération du profil", error: err.message });
    }
};

module.exports = { updateProfile, getMatches, getMe, likeUser, passUser, getMatchesAndLikes, getPublicProfile };
