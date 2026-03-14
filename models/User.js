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
    isVerified: {
        type: Boolean,
        default: true
    },
    verificationToken: String,
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
    locationCoords: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    country: { type: String, default: '' },
    department: { type: String, default: '' },
    city: { type: String, default: '' },
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
    photos: {
        type: [String],
        default: []
    },
    bio: {
        type: String,
        default: ''
    },
    hobbies: { type: String, default: '' },
    favoriteActivities: { type: String, default: '' },
    zodiacSign: { type: String, default: '' },
    religion: { type: String, default: '' },
    children: { type: String, default: '' },
    height: { type: String, default: '' },
    weight: { type: String, default: '' },
    eyeColor: { type: String, default: '' },
    hairColor: { type: String, default: '' },
    smoke: { type: String, default: '' },
    alcohol: { type: String, default: '' },
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
    resetPasswordExpires: Date,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    passed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    profileVisitors: [{
        visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        visitedAt: { type: Date, default: Date.now }
    }],
    superLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    superLikesReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    superLikeQuota: { type: Number, default: 0 },
    superLikeQuotaResetAt: { type: Date, default: null }
}, { timestamps: true });

userSchema.index({ locationCoords: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
