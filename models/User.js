const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['man', 'woman'],
        required: true
    },
    photo: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    bio: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
