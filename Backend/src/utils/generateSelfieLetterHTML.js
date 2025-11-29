import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const generateSelfieLetterHTML = ({ empresa, admin }) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Cargar logo en base64
  const logoPath = path.join(__dirname, "../assets/logo-syspyme.png");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Carta Selfie</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 30px;
          color: #333;
        }
        .logo {
          width: 160px;
          margin-bottom: 20px;
        }
        .firma {
          margin-top: 40px;
        }
        .signature-line {
          width: 250px;
          height: 1px;
          background-color: #333;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>

      <img src="data:image/png;base64,${logoBase64}" class="logo" />

      <h2>AUTENTICACIÓN CARTA SELFIE</h2>
      <h3>VALIDACIÓN DE IDENTIDAD</h3>

      <p>
        Yo, <b>${admin.nombre}</b>, actuando en nombre de la empresa 
        <b>${empresa.nombre}</b> identificada con NIT <b>${empresa.nit}</b>, 
        solicito la emisión del certificado de firma digital.
      </p>

      <p>
        Declaro que bajo la gravedad de juramento la información suministrada es verídica. 
        Adjunto fotografía con mi documento de identidad en mano para validación de identidad.
      </p>

      <h4>Acepto</h4>

      <div class="firma">
        <div class="signature-line"></div>
        Firma manuscrita<br/><br/>

        Teléfono: ${admin.telefono}<br/>
        Dirección: ${empresa.direccion}<br/>
        Correo electrónico: ${admin.correo}<br/>
      </div>

    </body>
    </html>
    `;

  return {
    html
  };
};