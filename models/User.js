const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: null
    },
    location: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['man', 'woman', ''],
        default: ''
    },
    lookingFor: {
        type: String,
        enum: ['man', 'woman', 'everyone', ''],
        default: ''
    },
    ageRange: {
        type: String,
        default: ''
    },
    photo: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        default: null
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'expired', 'none'],
        default: 'none'
    },
    subscriptionExpiry: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
