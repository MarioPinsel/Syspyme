import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

export const sendMessageDIAN = async (empresaNombre, emailDestino) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Obtener logo
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logoPath = path.join(__dirname, '../assets/logo-syspyme.png');

  const mailOptions = {
    from: `"SysPyME - Registro" <${process.env.EMAIL_USER}>`,
    to: emailDestino, // 🔥 Aquí se envía: process.env.EMAIL_USER
    subject: `📑 Nueva solicitud de registro: ${empresaNombre}`,
    html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Solicitud de Registro</title>
        </head>
        <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f5f7fa;">

          <table align="center" width="100%" cellspacing="0" cellpadding="0"
                 style="max-width:600px; background-color:#ffffff; border-radius:8px; margin:30px auto;
                 padding:40px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
            
            <tr>
              <td>

                <img src="cid:logo" alt="SysPyME" width="140" style="margin-bottom:20px;">

                <h2 style="color:#0b3954; margin-bottom:10px;">
                  Nueva solicitud de registro
                </h2>

                <p style="color:#444; font-size:15px; line-height:1.5;">
                  La empresa <b>${empresaNombre}</b> ha solicitado registro en <b>SysPyME</b>.<br>
                  Se solicita consultar en el panel administrativo para revisarla y aprobar o rechazar su solicitud, en caso de rechazo, redactar el motivo de la acción tomada para que se tome en cuenta, se de justificación y dar la respuesta a la empresa correspondiente. En caso de aceptar, haremos informar a la empresa que fue aprobada por la DIAN.
                </p>

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
        filename: "logo-syspyme.png",
        path: logoPath,
        cid: "logo"
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};
