const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailUtils');

const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || 'your_fallback_secret_key_123';
    return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

// Change Password (LOGGED IN)
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ success: true, message: 'Mot de passe mis à jour avec succès !' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur lors du changement de mot de passe', error: err.message });
    }
};

// Forgot Password (PUBLIC)
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Aucun utilisateur trouvé avec cet email.' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // In a real app, send actual email. For now, we'll return the token or just a success message.
        // The user asked for the option, so I'll implement the logic.
        console.log(`[AUTH] Reset Link: https://amour-et-sincerite.com//reset-password/${resetToken}`);

        res.json({
            success: true,
            message: 'Un lien de réinitialisation a été envoyé (vérifiez la console du serveur).',
            // Return token for development/demo purposes if no email setup
            debugToken: resetToken
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur forgot password', error: err.message });
    }
};

// Reset Password (PUBLIC)
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Le jeton de réinitialisation est invalide ou a expiré.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Votre mot de passe a été réinitialisé !' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur reset password', error: err.message });
    }
};

// Verify Email
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Le jeton de vérification est invalide.' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ success: true, message: 'Votre email a été vérifié avec succès ! Vous pouvez maintenant vous connecter.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erreur verification email', error: err.message });
    }
};

// Register
const register = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already in use.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Assign default Free plan
        const Plan = require('../models/Plan');
        const freePlan = await Plan.findOne({ name: 'Free Registration' });

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
            plan: freePlan ? freePlan._id : null,
            subscriptionStatus: freePlan ? 'active' : 'none',
            verificationToken
        });

        // Send email (async)
        sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: 'Compte créé ! Veuillez vérifier votre email pour activer votre compte.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Registration error', error: err.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: 'Veuillez vérifier votre email avant de vous connecter.' });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Logged in successfully!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                lookingFor: user.lookingFor,
                photo: user.photo,
                age: user.age,
                location: user.location,
                ageRange: user.ageRange,
                plan: user.plan,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Login error', error: err.message });
    }
};

module.exports = { register, login, changePassword, forgotPassword, resetPassword, verifyEmail };
