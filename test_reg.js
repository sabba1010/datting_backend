const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Plan = require('./models/Plan');

dotenv.config();

const testRegister = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        const email = `testuser_${Date.now()}@example.com`;
        const hashedPassword = await bcrypt.hash('password123', 10);

        const freePlan = await Plan.findOne({ name: 'Free Registration' });

        const user = await User.create({
            name: 'Test User',
            email: email,
            password: hashedPassword,
            plan: freePlan ? freePlan._id : null,
            subscriptionStatus: freePlan ? 'active' : 'none'
        });

        console.log('User created:', user.name, user.email);
        console.log('Is Verified:', user.isVerified);
        console.log('Assigned Plan ID:', user.plan);
        console.log('Subscription Status:', user.subscriptionStatus);

        const populatedUser = await User.findById(user._id).populate('plan');
        console.log('Populated Plan Name:', populatedUser.plan.name);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testRegister();
