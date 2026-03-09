const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Plan = require('./models/Plan');

dotenv.config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const plans = await Plan.find();
        console.log('Plans found:', plans.length);
        plans.forEach(p => console.log(`- ${p.name}: €${p.price}`));

        const freePlan = await Plan.findOne({ name: 'Free Registration' });
        console.log('Free Plan ID:', freePlan?._id);

        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).populate('plan');
        console.log('Recent Users:');
        recentUsers.forEach(u => {
            console.log(`- ${u.name} (${u.email}): Plan=${u.plan?.name || 'None'}, Status=${u.subscriptionStatus}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
