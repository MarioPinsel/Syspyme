import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export const sendVerificationEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const logoPath = path.join(__dirname, '../assets/logo-syspyme.png');

    const logoBase64 = fs.readFileSync(logoPath).toString("base64");

    const mailOptions = {
        from: `"SysPyME" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 Verifica tu cuenta en SysPyME',
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 30px; text-align: center;">
            <div style="background-color: #ffffff; border-radius: 10px; max-width: 600px; margin: auto; padding: 30px; box-shadow: 0 3px 10px rgba(0,0,0,0.1);">
                <img src="data:image/png;base64,${logoBase64}" alt="SysPyME" style="width: 180px; margin-bottom: 20px;" />
                <h2 style="color: #0A2540;">¡Verifica tu cuenta!</h2>
                <p style="font-size: 16px; color: #555;">
                    Gracias por registrarte en <strong>SysPyME</strong>.  
                    Usa el siguiente código para verificar tu cuenta:
                </p>
                <div style="margin: 30px auto; background-color: #00BFA6; color: white; font-size: 24px; letter-spacing: 2px; padding: 15px 25px; display: inline-block; border-radius: 8px;">
                    ${code}
                </div>
                <p style="color: #777; font-size: 14px;">
                    Este código expirará en <strong>15 minutos</strong> por razones de seguridad.
                </p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
                <p style="font-size: 13px; color: #aaa;">
                    © ${new Date().getFullYear()} SysPyME. Todos los derechos reservados.
                </p>
            </div>
        </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

