const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

router.get('/seed-production', async (req, res) => {
    try {
        const plans = [
            {
                name: "Free Registration",
                tier: "Free",
                price: 0,
                duration: 99,
                durationUnit: "year",
                features: ["Compte basique", "Profil limité", "Pas de messagerie"],
                priority: 1
            },
            // Essential
            {
                name: "Essential (1 Mois)",
                tier: "Essential",
                price: 44.99,
                duration: 1,
                durationUnit: "month",
                features: ["Explore unlimited profiles", "Go back to previous profiles", "See who liked your profile", "Read all your received messages", "Browse ad-free"],
                priority: 2
            },
            {
                name: "Essential (6 Mois)",
                tier: "Essential",
                price: 149.94,
                duration: 6,
                durationUnit: "month",
                features: ["Explore unlimited profiles", "Go back to previous profiles", "See who liked your profile", "Read all your received messages", "Browse ad-free"],
                priority: 3
            },
            // Premium
            {
                name: "Premium (1 Semaine)",
                tier: "Premium",
                price: 29.99,
                duration: 1,
                durationUnit: "week",
                features: ["All Essential features", "Send unlimited messages", "See who viewed your profile", "Unlock advanced search filters", "View all profiles in your search", "3 Super Likes per week", "Message read receipts"],
                priority: 4
            },
            {
                name: "Premium (1 Mois)",
                tier: "Premium",
                price: 54.99,
                duration: 1,
                durationUnit: "month",
                features: ["All Essential features", "Send unlimited messages", "See who viewed your profile", "Unlock advanced search filters", "View all profiles in your search", "3 Super Likes per week", "Message read receipts"],
                priority: 5
            },
            {
                name: "Premium (6 Mois)",
                tier: "Premium",
                price: 179.94,
                duration: 6,
                durationUnit: "month",
                features: ["All Essential features", "Send unlimited messages", "See who viewed your profile", "Unlock advanced search filters", "View all profiles in your search", "3 Super Likes per week", "Message read receipts"],
                priority: 6
            },
            // Prestige
            {
                name: "Prestige (1 Semaine)",
                tier: "Prestige",
                price: 39.99,
                duration: 1,
                durationUnit: "week",
                features: ["All Premium features", "Priority profile in search", "Profile highlight", "Higher visibility", "6 Super Likes per week"],
                priority: 7
            },
            {
                name: "Prestige (1 Mois)",
                tier: "Prestige",
                price: 79.99,
                duration: 1,
                durationUnit: "month",
                features: ["All Premium features", "Priority profile in search", "Profile highlight", "Higher visibility", "6 Super Likes per week"],
                priority: 8
            },
            {
                name: "Prestige (6 Mois)",
                tier: "Prestige",
                price: 269.94,
                duration: 6,
                durationUnit: "month",
                features: ["All Premium features", "Priority profile in search", "Profile highlight", "Higher visibility", "6 Super Likes per week"],
                priority: 9
            }
        ];

        await Plan.deleteMany({});
        await Plan.insertMany(plans);
        res.json({ success: true, message: "Subscription plans seeded successfully on production!", count: plans.length });
    } catch (err) {
        res.status(500).json({ success: false, message: "Seeding failed", error: err.message });
    }
});

module.exports = router;
