const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    durationUnit: {
        type: String,
        enum: ['day', 'week', 'month', 'year'],
        required: true
    },
    features: [{
        type: String
    }],
    tier: {
        type: String,
        enum: ['Free', 'Essential', 'Essentiel', 'Premium', 'Prestige'],
        default: 'Free'
    },
    priority: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
