const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

router.get('/seed-production', async (req, res) => {
    try {
        const plans = [
            // Essential - 2 durations (6 months best price, 1 month recommended)
            {
                name: "Essential (6 Mois)",
                tier: "Essential",
                price: 149.94,  // 24.99/month
                duration: 6,
                durationUnit: "month",
                features: ["Explore unlimited profiles", "Go back to previous profiles", "See who liked your profile", "Read all your received messages", "Browse ad-free"],
                priority: 1
            },
            {
                name: "Essential (1 Mois)",
                tier: "Essential",
                price: 44.99,
                duration: 1,
                durationUnit: "month",
                features: ["Explore unlimited profiles", "Go back to previous profiles", "See who liked your profile", "Read all your received messages", "Browse ad-free"],
                priority: 2
            },
            // Premium - 3 durations
            {
                name: "Premium (6 Mois)",
                tier: "Premium",
                price: 179.94,  // 29.99/month
                duration: 6,
                durationUnit: "month",
                features: ["Explore unlimited profiles", "Go back to previous profiles", "See who liked your profile", "Read all your received messages", "Browse ad-free", "Send unlimited messages", "See who viewed your profile", "Unlock advanced search filters", "View all profiles in your search", "3 Super Likes per week", "See when your messages are read"],
                priority: 3
            },
            {
                name: "Premium (1 Mois)",
                tier: "Premium",
                price: 54.99,
                duration: 1,
                durationUnit: "month",
                features: ["Explore unlimited profiles", "Go back to previous profiles", "See who liked your profile", "Read all your received messages", "Browse ad-free", "Send unlimited messages", "See who viewed your profile", "Unlock advanced search filters", "View all profiles in your search", "3 Super Likes per week", "See when your messages are read"],
                priority: 4
            },
            {
                name: "Premium (1 Semaine)",
                tier: "Premium",
                price: 29.99,
                duration: 1,
                durationUnit: "week",
                features: ["Explore unlimited profiles", "Go back to previous profiles", "See who liked your profile", "Read all your received messages", "Browse ad-free", "Send unlimited messages", "See who viewed your profile", "Unlock advanced search filters", "View all profiles in your search", "3 Super Likes per week", "See when your messages are read"],
                priority: 5
            },
            // Prestige - 3 durations
            {
                name: "Prestige (6 Mois)",
                tier: "Prestige",
                price: 269.94,  // 44.99/month
                duration: 6,
                durationUnit: "month",
                features: ["Explore unlimited profiles", "Go back to previous profiles", "See who liked your profile", "Read all your received messages", "Browse ad-free", "Send unlimited messages", "See who viewed your profile", "Unlock advanced search filters", "View all profiles in your search", "6 Super Likes per week", "See when your messages are read"],
                priority: 6
            },
            {
                name: "Prestige (1 Mois)",
                tier: "Prestige",
                price: 79.99,
                duration: 1,
                durationUnit: "month",
                features: ["Explore unlimited profiles", "Go back to previous profiles", "See who liked your profile", "Read all your received messages", "Browse ad-free", "Send unlimited messages", "See who viewed your profile", "Unlock advanced search filters", "View all profiles in your search", "6 Super Likes per week", "See when your messages are read"],
                priority: 7
            },
            {
                name: "Prestige (1 Semaine)",
                tier: "Prestige",
                price: 39.99,
                duration: 1,
                durationUnit: "week",
                features: ["Explore unlimited profiles", "Go back to previous profiles", "See who liked your profile", "Read all your received messages", "Browse ad-free", "Send unlimited messages", "See who viewed your profile", "Unlock advanced search filters", "View all profiles in your search", "6 Super Likes per week", "See when your messages are read"],
                priority: 8
            }
        ];

        await Plan.deleteMany({});
        await Plan.insertMany(plans);
        res.json({ success: true, message: "Plans seeded successfully!", count: plans.length });
    } catch (err) {
        res.status(500).json({ success: false, message: "Seeding failed", error: err.message });
    }
});

module.exports = router;
