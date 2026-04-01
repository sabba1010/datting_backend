const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT == 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        }
    });
};

const sendVerificationEmail = async (email, token) => {
    try {
        const transporter = createTransporter();
        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`;

        const mailOptions = {
            from: `"Amour Et Sincerité" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Vérifiez votre adresse email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #ff4757; text-align: center;">Bienvenue sur Amour Et Sincerité !</h2>
                    <p>Merci de vous être inscrit. Pour commencer votre aventure, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" style="background-color: #ff4757; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Confirmer mon email</a>
                    </div>
                    <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                    <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999; text-align: center;">Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
                </div>
            `
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            console.log(`[EMAIL] Verification sent to ${email}`);
        } else {
            console.log(`[EMAIL][MOCK] To: ${email}`);
            console.log(`[EMAIL][MOCK] Link: ${verificationUrl}`);
        }
    } catch (err) {
        console.error('[EMAIL] Error sending verification:', err);
    }
};

const sendPasswordResetEmail = async (email, token) => {
    try {
        const transporter = createTransporter();
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;

        const mailOptions = {
            from: `"Amour Et Sincerité" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #ff4757; text-align: center;">Réinitialisation du mot de passe</h2>
                    <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #ff4757; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Réinitialiser mon mot de passe</a>
                    </div>
                    <p>Ce lien est valable pendant 1 heure. Si vous n'avez pas demandé de réinitialisation, vous pouvez ignorer cet email.</p>
                    <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
                    <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999; text-align: center;">Amour Et Sincerité - Trouvez l'étincelle.</p>
                </div>
            `
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            console.log(`[EMAIL] Password reset sent to ${email}`);
        } else {
            console.log(`[EMAIL][MOCK] To: ${email}`);
            console.log(`[EMAIL][MOCK] Link: ${resetUrl}`);
        }
    } catch (err) {
        console.error('[EMAIL] Error sending reset email:', err);
        throw err;
    }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
