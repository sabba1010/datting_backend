const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET || 'your_fallback_secret_key_123';
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id).select('-password').populate('plan');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Account not found.', code: 'ACCOUNT_DELETED' });
        }

        if (user.isSuspended) {
            return res.status(403).json({ success: false, message: "Votre compte a été suspendu par l'administrateur.", code: 'ACCOUNT_SUSPENDED' });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Token invalid or expired.' });
    }
};

module.exports = { protect };
