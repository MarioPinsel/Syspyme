import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.join(__dirname, '../assets/logo-syspyme.png');

// CONFIGURAR TRANSPORTER
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


/* =======================================================
   ✔ CORREO CUANDO LA DIAN APRUEBA LA EMPRESA
   ======================================================= */
export const sendResponseDIANAccepted = async (correoAdmin, empresaNombre, handleAdmin, adminPass) => {

  const mailOptions = {
    from: `"SysPyME - DAIN" <${process.env.EMAIL_USER}>`,
    to: correoAdmin,
    subject: `✔ Su empresa "${empresaNombre}" ha sido aprobada por la DAIN`,
    html: `
        <!DOCTYPE html>
        <html lang="es">
        <body style="font-family: Arial, sans-serif; background:#f5f7fa; padding:0; margin:0;">
        
        <table width="100%" align="center" cellpadding="0" cellspacing="0" 
               style="max-width:600px; margin:40px auto; background:#fff; border-radius:8px; 
                      padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            <tr>
                <td align="center">
                    <img src="cid:logo" alt="SysPyME" width="130" style="margin-bottom:20px;">
                    <h2 style="color:#0b3954; margin-bottom:10px;">✔ ¡Empresa aprobada!</h2>

                    <p style="font-size:15px; color:#444; line-height:1.5;">
                        Estimado representante,<br><br>
                        Informamos que la empresa <b>${empresaNombre}</b> ha sido 
                        <b>verificada y aprobada por la DAIN</b>.
                    </p>

                    <p style="font-size:15px; color:#444; line-height:1.5; margin-top:20px;">
                        Ya puede iniciar sesión desde la página principal de SysPyME.
                    </p>

                    <div style="margin:25px 0; padding:20px; background:#f0f8ff; border-radius:8px; text-align:left;">
                        <p><b>Datos de acceso del administrador:</b></p>
                        <p><b>Empresa:</b> ${empresaNombre}</p>
                        <p><b>Handle:</b> ${handleAdmin}</p>
                        <p><b>Correo:</b> ${correoAdmin}</p>
                        <p><b>Contraseña del administrador:</b> ${adminPass}</p>
                        <p style="font-size:13px; color:#777; margin-top:10px;">
                            *Nota: La contraseña del administrador ha sido asignada por el sistema únicamente para el acceso inicial.  
                            Aunque la empresa define su propia contraseña de acceso general, esta clave administrativa es exclusiva, no se podrá recuperar y será necesaria para realizar configuraciones internas. Le recomendamos almacenarla de forma segura.*
                        </p>

                    </div>

                    <p style="font-size:14px; color:#555;">
                        Para iniciar sesión, diríjase a la página principal e ingrese:
                        <br>• Nombre de la empresa<br>• Contraseña de la empresa<br>• Handle o correo del administrador<br>• Contraseña asignada
                    </p>

                    <div style="border-top:1px solid #eee; margin-top:30px; padding-top:15px;">
                        <p style="font-size:12px; color:#999; margin:0;">
                            © ${new Date().getFullYear()} SysPyME — Todos los derechos reservados.
                        </p>
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



/* =======================================================
   ✔ CORREO CUANDO LA DIAN RECHAZA LA EMPRESA
   ======================================================= */
export const sendResponseDIANRejected = async (correoAdmin, motivo) => {

  const mailOptions = {
    from: `"SysPyME - DAIN" <${process.env.EMAIL_USER}>`,
    to: correoAdmin,
    subject: '❌ Su registro empresarial ha sido rechazado por la DAIN',
    html: `
        <!DOCTYPE html>
        <html lang="es">
        <body style="font-family: Arial, sans-serif; background:#f5f7fa; padding:0; margin:0;">

        <table width="100%" align="center" cellpadding="0" cellspacing="0" 
               style="max-width:600px; margin:40px auto; background:#fff; border-radius:8px; 
                      padding:40px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
            <tr>
                <td align="center">
                    <img src="cid:logo" alt="SysPyME" width="130" style="margin-bottom:20px;">
                    <h2 style="color:#b00020; margin-bottom:10px;">❌ Registro rechazado</h2>

                    <p style="font-size:15px; color:#444; line-height:1.5;">
                        Estimado representante,<br><br>
                        La DAIN ha revisado la información enviada para el registro empresarial, 
                        pero lamentablemente <b>no ha sido aprobada</b>.
                    </p>

                    <p style="font-size:15px; color:#444; line-height:1.5; margin-top:15px;">
                        <b>Motivo del rechazo:</b>
                        <br>
                        <span style="color:#b00020;">${motivo}</span>
                    </p>

                    <p style="font-size:14px; color:#555; margin-top:20px;">
                        Por favor, corrija los datos necesarios e intente registrar la empresa nuevamente.
                    </p>

                    <p style="font-size:14px; color:#555; margin-top:10px;">
                        Agradecemos su atención y quedamos atentos a su próximo registro.
                    </p>

                    <div style="border-top:1px solid #eee; margin-top:30px; padding-top:15px;">
                        <p style="font-size:12px; color:#999; margin:0;">
                            © ${new Date().getFullYear()} SysPyME — Todos los derechos reservados.
                        </p>
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

export const sendCertificateAcceptedEmail = async (emailDestino, empresaNombre) => {
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

  const mailOptions = {
    from: `"SysPyME - DAIN" <${process.env.EMAIL_USER}>`,
    to: emailDestino,
    subject: `✅ Certificado Digital Aprobado - ${empresaNombre}`,
    html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Certificado Aprobado</title>
            </head>
            <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f5f7fa;">

              <table align="center" width="100%" cellspacing="0" cellpadding="0"
                     style="max-width:600px; background-color:#ffffff; border-radius:8px; margin:30px auto;
                     padding:40px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                
                <tr>
                  <td>

                    <img src="cid:logo" alt="SysPyME" width="140" style="margin-bottom:20px;">

                    <h2 style="color:#4CAF50; margin-bottom:10px;">
                      ✅ Certificado Digital Aprobado
                    </h2>

                    <p style="color:#444; font-size:15px; line-height:1.5;">
                      <b>${empresaNombre}</b>, nos complace informarle que su <b>Certificado Digital</b> ha sido <b>aprobado exitosamente</b> por la DAIN.
                    </p>

                    <p style="color:#444; font-size:15px; line-height:1.5;">
                      Ya puede iniciar sesión en <b>SysPyME</b> y comenzar a utilizar todos los servicios de nuestro sistema.
                    </p>

                    <div style="border-top:1px solid #eee; margin-top:30px; padding-top:15px;">
                      <p style="font-size:12px; color:#999; margin:0;">
                        &copy; ${new Date().getFullYear()} <b>SysPyME</b>. Todos los derechos reservados.
                      </p>
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

export const sendCertificateRejectedEmail = async (emailDestino, empresaNombre, motivo) => {
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

  const mailOptions = {
    from: `"SysPyME - DAIN" <${process.env.EMAIL_USER}>`,
    to: emailDestino,
    subject: `❌ Certificado Digital Rechazado - ${empresaNombre}`,
    html: `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Certificado Rechazado</title>
            </head>
            <body style="margin:0; padding:0; font-family:Arial, sans-serif; background-color:#f5f7fa;">

              <table align="center" width="100%" cellspacing="0" cellpadding="0"
                     style="max-width:600px; background-color:#ffffff; border-radius:8px; margin:30px auto;
                     padding:40px; text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                
                <tr>
                  <td>

                    <img src="cid:logo" alt="SysPyME" width="140" style="margin-bottom:20px;">

                    <h2 style="color:#d32f2f; margin-bottom:10px;">
                      ❌ Certificado Digital Rechazado
                    </h2>

                    <p style="color:#444; font-size:15px; line-height:1.5;">
                      <b>${empresaNombre}</b>, lamentamos informarle que su <b>Certificado Digital</b> ha sido <b>rechazado</b> por la DAIN.
                    </p>

                    <div style="background:#fff3cd; border-left:4px solid #ff9800; padding:15px; margin:20px 0; text-align:left; border-radius:4px;">
                      <p style="margin:0; color:#856404; font-size:14px;">
                        <strong>Motivo del rechazo:</strong><br/>
                        ${motivo}
                      </p>
                    </div>

                    <p style="color:#444; font-size:15px; line-height:1.5;">
                      Por favor, corrija la información según las observaciones indicadas y vuelva a enviar su certificado digital.
                    </p>

                    <p style="color:#666; font-size:14px; line-height:1.5; margin-top:20px;">
                      Para reenviar el certificado, inicie sesión en <b>SysPyME</b> con sus credenciales. El sistema lo redirigirá automáticamente al formulario de certificado digital para que pueda completar nuevamente el proceso.
                    </p>

                    <p style="color:#999; font-size:13px; line-height:1.5; margin-top:20px;">
                      Si tiene dudas sobre el motivo del rechazo, puede contactarnos respondiendo a este correo.
                    </p>

                    <div style="border-top:1px solid #eee; margin-top:30px; padding-top:15px;">
                      <p style="font-size:12px; color:#999; margin:0;">
                        &copy; ${new Date().getFullYear()} <b>SysPyME</b>. Todos los derechos reservados.
                      </p>
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