const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env from current directory or one level up
const result = dotenv.config({ path: './Backend/.env' });
if (result.error) {
    dotenv.config({ path: '.env' });
}

console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Defined' : 'UNDEFINED');

const planSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    durationUnit: { type: String, enum: ['day', 'week', 'month', 'year'], required: true },
    features: [{ type: String }],
    priority: { type: Number, default: 0 }
}, { timestamps: true });

const Plan = mongoose.models.Plan || mongoose.model('Plan', planSchema);

const plans = [
    {
        name: "Free Registration",
        price: 0,
        duration: 99,
        durationUnit: "year",
        features: ["Compte basique", "Profil limité", "Pas de messagerie"],
        priority: 1
    },
    {
        name: "Weekly Plan",
        price: 9.90,
        duration: 1,
        durationUnit: "week",
        features: ["Messagerie illimitée", "Voir tous les profils", "Matchs de base"],
        priority: 2
    },
    {
        name: "Monthly Plan",
        price: 24.90,
        duration: 1,
        durationUnit: "month",
        features: ["Tout le forfait Weekly", "Visibilité prioritaire", "Filtres avancés"],
        priority: 3
    },
    {
        name: "6-Month Plan",
        price: 49.90,
        duration: 6,
        durationUnit: "month",
        features: ["Premium complet", "Classement prioritaire", "Boosts inclus"],
        priority: 4
    }
];

const seedPlans = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        await Plan.deleteMany({});
        console.log('Cleared existing plans.');

        await Plan.insertMany(plans);
        console.log('Plans seeded successfully!');

        process.exit();
    } catch (err) {
        console.error('Error seeding plans:', err);
        process.exit(1);
    }
};

seedPlans();
