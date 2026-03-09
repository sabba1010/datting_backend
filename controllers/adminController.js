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

        // Recent subscribers (users with a paid plan)
        const freePlan = await Plan.findOne({ price: 0 });
        const recentSubscribers = await User.find({
            plan: { $ne: freePlan ? freePlan._id : null },
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

module.exports = { getDashboardStats };
