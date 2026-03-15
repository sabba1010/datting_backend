const Report = require('../models/Report');

const reportUser = async (req, res) => {
    try {
        const { reportedUserId, reason } = req.body;
        const reporterId = req.user._id;

        if (!reportedUserId || !reason) {
            return res.status(400).json({ success: false, message: "Informations de signalement manquantes." });
        }

        const report = new Report({
            reporter: reporterId,
            reportedUser: reportedUserId,
            reason
        });

        await report.save();

        res.json({ success: true, message: "Utilisateur signalé avec succès. Les administrateurs vont examiner votre demande." });
    } catch (err) {
        console.error(`[ReportUser] Error: ${err.message}`);
        res.status(500).json({ success: false, message: "Erreur lors du signalement de l'utilisateur.", error: err.message });
    }
};

module.exports = { reportUser };
