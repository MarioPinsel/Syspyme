import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"SysPyme" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verifica tu cuenta',
        text: `Tu código de verificación es: ${code}, expirará en 10 minutos.`,
    };

    await transporter.sendMail(mailOptions);


};
