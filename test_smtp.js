const nodemailer = require('nodemailer');
require('dotenv').config();

const testSMTP = async () => {
    const user = process.env.EMAIL_USER || 'amour-et-sincerite@hotmail.com';
    const pass = process.env.EMAIL_PASS || 'ildx twda ncro zakh';
    const host = process.env.SMTP_HOST || 'smtp-mail.outlook.com';
    const port = process.env.SMTP_PORT || 587;

    console.log('Testing SMTP with:');
    console.log(`Host: ${host}`);
    console.log(`Port: ${port}`);
    console.log(`User: ${user}`);

    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // STARTTLS
        auth: {
            user: user,
            pass: pass
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Attempting to verify transporter with host: smtp.office365.com...');
        await transporter.verify();
        console.log('SMTP connection established successfully! ✅');

        const info = await transporter.sendMail({
            from: `"Test Mail" <${user}>`,
            to: user, // Send to self
            subject: 'SMTP Test - Amour Et Sincerité',
            text: 'This is a test email to verify SMTP configuration.'
        });

        console.log('Test email sent: %s', info.messageId);
    } catch (error) {
        console.error('SMTP Error: ❌', error);
    }
};

testSMTP();
