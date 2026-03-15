const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

const ESSENTIAL_FEATURES = [
    "Explore unlimited profiles",
    "Go back to previous profiles",
    "See who liked your profile",
    "Read all your received messages",
    "Browse ad-free"
];

const PREMIUM_FEATURES = [
    "Explore unlimited profiles",
    "Go back to previous profiles",
    "See who liked your profile",
    "Read all your received messages",
    "Browse ad-free",
    "Send unlimited messages",
    "See who viewed your profile",
    "Unlock advanced search filters",
    "View all profiles in your search",
    "Send 3 Super Likes per week",
    "See when your messages are read"
];

const PRESTIGE_FEATURES = [
    "Explore unlimited profiles",
    "Go back to previous profiles",
    "See who liked your profile",
    "Read all your received messages",
    "Browse ad-free",
    "Send unlimited messages",
    "See who viewed your profile",
    "Unlock advanced search filters",
    "View all profiles in your search",
    "Send 6 Super Likes per week",
    "See when your messages are read"
];

router.get('/seed-production', async (req, res) => {
    try {
        const plans = [
            // Essential — 2 durations
            {
                name: "Essential (6 Mois)",
                tier: "Essential",
                price: 149.94,
                duration: 6,
                durationUnit: "month",
                features: ESSENTIAL_FEATURES,
                priority: 1
            },
            {
                name: "Essential (1 Mois)",
                tier: "Essential",
                price: 44.99,
                duration: 1,
                durationUnit: "month",
                features: ESSENTIAL_FEATURES,
                priority: 2
            },
            // Premium — 3 durations
            {
                name: "Premium (6 Mois)",
                tier: "Premium",
                price: 179.94,
                duration: 6,
                durationUnit: "month",
                features: PREMIUM_FEATURES,
                priority: 3
            },
            {
                name: "Premium (1 Mois)",
                tier: "Premium",
                price: 54.99,
                duration: 1,
                durationUnit: "month",
                features: PREMIUM_FEATURES,
                priority: 4
            },
            {
                name: "Premium (1 Semaine)",
                tier: "Premium",
                price: 29.99,
                duration: 1,
                durationUnit: "week",
                features: PREMIUM_FEATURES,
                priority: 5
            },
            // Prestige — 3 durations
            {
                name: "Prestige (6 Mois)",
                tier: "Prestige",
                price: 269.94,
                duration: 6,
                durationUnit: "month",
                features: PRESTIGE_FEATURES,
                priority: 6
            },
            {
                name: "Prestige (1 Mois)",
                tier: "Prestige",
                price: 79.99,
                duration: 1,
                durationUnit: "month",
                features: PRESTIGE_FEATURES,
                priority: 7
            },
            {
                name: "Prestige (1 Semaine)",
                tier: "Prestige",
                price: 39.99,
                duration: 1,
                durationUnit: "week",
                features: PRESTIGE_FEATURES,
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
