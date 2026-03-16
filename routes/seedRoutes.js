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
            {
                name: "Free Registration",
                tier: "Free",
                price: 0,
                duration: 0,
                durationUnit: "day",
                features: ["Compte basique", "Profil limité", "Pas de messagerie"],
                priority: 1
            },
            {
                name: "Weekly Plan",
                tier: "Essential",
                price: 9.90,
                duration: 1,
                durationUnit: "week",
                features: ["Messagerie illimitée", "Voir tous les profils", "Matchs de base"],
                priority: 2
            },
            {
                name: "Monthly Plan",
                tier: "Essential",
                price: 24.90,
                duration: 1,
                durationUnit: "month",
                features: ["Tout le forfait Weekly", "Visibilité prioritaire", "Filtres avancés", "Messagerie illimitée"],
                priority: 3
            },
            {
                name: "6-Month Plan",
                tier: "Essential",
                price: 44.90,
                duration: 6,
                durationUnit: "month",
                features: ["Premium complet", "Classement prioritaire", "Boosts inclus", "Messagerie illimitée"],
                priority: 4
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
