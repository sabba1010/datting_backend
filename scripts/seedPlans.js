const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plan = require('../models/Plan');

dotenv.config();

const plans = [
    {
        name: 'Free Registration',
        price: 0,
        duration: 99,
        durationUnit: 'year',
        features: [
            'Basic account creation',
            'Create profile',
            'Browse limited profiles'
        ],
        priority: 1
    },
    {
        name: 'Weekly Plan',
        price: 9.90,
        duration: 1,
        durationUnit: 'week',
        features: [
            'Unlock messaging',
            'Unlimited profile views',
            'Basic matching features'
        ],
        priority: 2
    },
    {
        name: 'Monthly Plan',
        price: 24.90,
        duration: 1,
        durationUnit: 'month',
        features: [
            'All weekly features',
            'Priority profile visibility',
            'Advanced matching filters'
        ],
        priority: 3
    },
    {
        name: '6-Month Plan',
        price: 49.90,
        duration: 6,
        durationUnit: 'month',
        features: [
            'All premium features',
            'Priority ranking in search',
            'Unlimited messaging',
            'Advanced filters and boosts'
        ],
        priority: 4
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
