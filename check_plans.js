const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Plan = require('./models/Plan');

dotenv.config();

const checkPlans = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Plan.countDocuments();
        const plans = await Plan.find();
        console.log(`Plan count: ${count}`);
        console.log('Plans:', JSON.stringify(plans, null, 2));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkPlans();
