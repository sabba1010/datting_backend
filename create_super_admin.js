const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        let admin = await User.findOne({ email: 'admin@gmail.com' });
        if (admin) {
            console.log('Admin already exists. Updating password and role...');
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash('123456', salt);
            admin.role = 'admin';
            await admin.save();
            console.log('Admin updated.');
        } else {
            console.log('Creating new admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123456', salt);
            
            admin = new User({
                name: 'Super Admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            await admin.save();
            console.log('Admin created successfully.');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        mongoose.disconnect();
    }
};

createAdmin();
