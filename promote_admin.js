const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const promote = async () => {
    const email = process.argv[2];
    if (!email) {
        console.error('Please provide an email: node promote_admin.js user@example.com');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
        if (user) {
            console.log(`User ${user.email} is now an admin.`);
        } else {
            console.log('User not found.');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

promote();
