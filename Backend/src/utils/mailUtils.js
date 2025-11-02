import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

export const sendVerificationEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Obtener ruta del logo (ya en tu proyecto)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const logoPath = path.join(__dirname, '../assets/logo-syspyme.png');

    const mailOptions = {
        from: `"SysPyME" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 Verifica tu cuenta en SysPyME',
        html: `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verificación de cuenta - SysPyME</title>
    </head>
    <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f5f7fa;">

      <table align="center" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px; background-color:#ffffff; border-radius:8px; margin:30px auto; padding:40px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td>
            <img src="cid:logo" alt="SysPyME" width="140" style="margin-bottom:20px;">

            <h2 style="color:#0b3954; margin-bottom:10px;">¡Verifica tu cuenta!</h2>

            <p style="color:#444; font-size:15px; line-height:1.5;">
              Gracias por entrar en <b>SysPyME</b>.<br>
              Usa el siguiente código para verificar tu cuenta:
            </p>

            <div style="display:inline-block; padding:12px 30px; background-color:#00c9a7; color:#ffffff; font-size:24px; font-weight:bold; border-radius:6px; letter-spacing:2px; margin:20px 0;">
              ${code}
            </div>

            <p style="color:#777; font-size:13px; margin-top:10px;">
              Este código expirará en <b>15 minutos</b> por razones de seguridad.
            </p>

            <!-- Footer visible (no se oculta en Gmail) -->
            <div style="border-top:1px solid #eee; margin-top:30px; padding-top:15px;">
              <p style="font-size:12px; color:#999; margin:0;">
                &copy; ${new Date().getFullYear()} <b>SysPyME</b>. Todos los derechos reservados.
              </p>
              <p style="font-size:10px; color:#fff; margin:0;">.</p>
            </div>
          </td>
        </tr>
      </table>

    </body>
    </html>
    `,
        attachments: [
            {
                filename: 'logo-syspyme.png',
                path: logoPath,
                cid: 'logo'
            }
        ]
    };

    await transporter.sendMail(mailOptions);
};
