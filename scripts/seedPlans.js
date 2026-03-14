const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plan = require('../models/Plan');

dotenv.config();

const plans = [
    {
        name: 'Gratuit',
        tier: 'Free',
        price: 0,
        duration: 99,
        durationUnit: 'year',
        features: [
            'Basic profile create',
            'Browse profiles',
            'Limited search',
            'Receive messages',
            'Like profiles'
        ],
        priority: 1
    },
    {
        name: 'Essentiel (Mensuel)',
        tier: 'Essentiel',
        price: 24.99,
        duration: 1,
        durationUnit: 'month',
        features: [
            'Unlimited profile browsing',
            'See who liked you',
            'Read all messages',
            'No ads',
            'Revisit previous profiles'
        ],
        priority: 2
    },
    {
        name: 'Essentiel (6 Mois)',
        tier: 'Essentiel',
        price: 89.94, // 14.99 * 6
        duration: 6,
        durationUnit: 'month',
        features: [
            'Unlimited profile browsing',
            'See who liked you',
            'Read all messages',
            'No ads',
            'Revisit previous profiles'
        ],
        priority: 3
    },
    {
        name: 'Premium (Mensuel)',
        tier: 'Premium',
        price: 29.99,
        duration: 1,
        durationUnit: 'month',
        features: [
            'Unlimited messaging',
            'See who visited your profile',
            'Advanced search filters',
            'See all search results',
            '3 Super Likes per week',
            'Message read receipts'
        ],
        priority: 4
    },
    {
        name: 'Premium (6 Mois)',
        tier: 'Premium',
        price: 119.94, // 19.99 * 6
        duration: 6,
        durationUnit: 'month',
        features: [
            'Unlimited messaging',
            'See who visited your profile',
            'Advanced search filters',
            'See all search results',
            '3 Super Likes per week',
            'Message read receipts'
        ],
        priority: 5
    },
    {
        name: 'Prestige VIP (Mensuel)',
        tier: 'Prestige',
        price: 44.99,
        duration: 1,
        durationUnit: 'month',
        features: [
            'All Premium features',
            '6 Super Likes per week',
            'Profile priority in search',
            'Profile highlight',
            'Higher visibility'
        ],
        priority: 6
    },
    {
        name: 'Prestige VIP (6 Mois)',
        tier: 'Prestige',
        price: 179.94, // 29.99 * 6
        duration: 6,
        durationUnit: 'month',
        features: [
            'All Premium features',
            '6 Super Likes per week',
            'Profile priority in search',
            'Profile highlight',
            'Higher visibility'
        ],
        priority: 7
    }
];

const seedPlans = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing plans
        await Plan.deleteMany({});
        console.log('Existing plans cleared.');

        // Insert new plans
        await Plan.insertMany(plans);
        console.log('Subscription plans seeded successfully!');

        process.exit();
    } catch (err) {
        console.error('Error seeding plans:', err);
        process.exit(1);
    }
};

seedPlans();
