const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

router.get('/seed-production', async (req, res) => {
    try {
        const plans = [
            {
                name: "Free Registration",
                price: 0,
                duration: 0,
                durationUnit: "day",
                features: ["Compté basique", "Profil limité", "Pas de messagerie"],
                priority: 1
            },
            {
                name: "Weekly Plan",
                price: 9.90,
                duration: 1,
                durationUnit: "week",
                features: ["Messagerie illimitée", "Voir tous les profils", "Matchs de base"],
                priority: 2
            },
            {
                name: "Monthly Plan",
                price: 24.90,
                duration: 1,
                durationUnit: "month",
                features: ["Tout le forfait Weekly", "Visibilité prioritaire", "Filtres avancés"],
                priority: 3
            },
            {
                name: "6-Month Plan",
                price: 49.90,
                duration: 6,
                durationUnit: "month",
                features: ["Premium complet", "Classement prioritaire", "Boosts inclus"],
                priority: 4
            }
        ];

        await Plan.deleteMany({});
        await Plan.insertMany(plans);
        res.json({ success: true, message: "Plans seeded successfully on production!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Seeding failed", error: err.message });
    }
});

module.exports = router;
