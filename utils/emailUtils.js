const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Or your preferred service
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASS || 'your-app-password'
            }
        });

        const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${token}`;

        const mailOptions = {
            from: `"Find Your Spark" <${process.env.EMAIL_USER || 'your-email@gmail.com'}>`,
            to: email,
            subject: 'Vérifiez votre adresse email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #ff4757; text-align: center;">Bienvenue sur Find Your Spark !</h2>
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

module.exports = { sendVerificationEmail };
