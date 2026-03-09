const Plan = require('../models/Plan');
const User = require('../models/User');

const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find().sort({ priority: 1 });
        res.json({ success: true, plans });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching plans', error: err.message });
    }
};

const subscribe = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user.id;

        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found.' });
        }

        let expiryDate = new Date();
        if (plan.durationUnit === 'day') {
            expiryDate.setDate(expiryDate.getDate() + plan.duration);
        } else if (plan.durationUnit === 'week') {
            expiryDate.setDate(expiryDate.getDate() + (plan.duration * 7));
        } else if (plan.durationUnit === 'month') {
            expiryDate.setMonth(expiryDate.getMonth() + plan.duration);
        } else if (plan.durationUnit === 'year') {
            expiryDate.setFullYear(expiryDate.getFullYear() + plan.duration);
        }

        const user = await User.findByIdAndUpdate(userId, {
            plan: planId,
            subscriptionStatus: 'active',
            subscriptionExpiry: expiryDate
        }, { new: true }).populate('plan');

        res.json({
            success: true,
            message: `Successfully subscribed to ${plan.name}`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan,
                subscriptionStatus: user.subscriptionStatus,
                subscriptionExpiry: user.subscriptionExpiry
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Subscription error', error: err.message });
    }
};

module.exports = { getPlans, subscribe };
