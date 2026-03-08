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
        enum: ['man', 'woman', ''],
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
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
