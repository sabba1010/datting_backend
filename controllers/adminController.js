const User = require('../models/User');
const Plan = require('../models/Plan');

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const menCount = await User.countDocuments({ gender: 'man' });
        const womenCount = await User.countDocuments({ gender: 'woman' });

        // Stats by plan
        const plans = await Plan.find();
        const planStats = await Promise.all(plans.map(async (plan) => {
            const count = await User.countDocuments({ plan: plan._id });
            return {
                name: plan.name,
                count,
                price: plan.price,
                revenue: count * plan.price
            };
        }));

        const totalRevenue = planStats.reduce((acc, curr) => acc + curr.revenue, 0);

        // Recent subscribers (users with a paid plan with price > 0)
        const paidPlans = await Plan.find({ price: { $gt: 0 } }).select('_id');
        const paidPlanIds = paidPlans.map(p => p._id);

        const recentSubscribers = await User.find({
            plan: { $in: paidPlanIds },
            subscriptionStatus: 'active'
        })
            .sort({ updatedAt: -1 })
            .limit(10)
            .populate('plan', 'name price');

        res.json({
            success: true,
            stats: {
                totalUsers,
                gender: { men: menCount, women: womenCount, other: totalUsers - (menCount + womenCount) },
                planStats,
                totalRevenue,
                recentSubscribers: recentSubscribers.map(s => ({
                    id: s._id,
                    name: s.name,
                    email: s.email,
                    planName: s.plan?.name,
                    price: s.plan?.price,
                    date: s.updatedAt
                }))
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching admin stats', error: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password -likes -likedBy -matches -passed -blockedUsers')
            .populate('plan', 'name price tier')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            users: users.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                gender: u.gender,
                age: u.age,
                location: u.location,
                photo: u.photo,
                planName: u.plan?.name || 'Free',
                planTier: u.plan?.tier || 'Free',
                subscriptionStatus: u.subscriptionStatus,
                createdAt: u.createdAt
            }))
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching users', error: err.message });
    }
};

module.exports = { getDashboardStats, getAllUsers };
