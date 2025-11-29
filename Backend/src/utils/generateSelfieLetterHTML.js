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
      <title>Certificado Digital - SysPyME</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px 40px; // ✅ Solo padding lateral
          color: #333;
          line-height: 1.6;
        }   
        .logo {
          width: 160px;
          margin-bottom: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #0b3954;
        }
        .section {
          margin: 30px 0;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #0b3954;
        }
        .section h4 {
          color: #0b3954;
          margin-top: 0;
          margin-bottom: 15px;
        }
        .info-row {
          margin: 12px 0;
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: bold;
          color: #495057;
        }
        .value {
          color: #212529;
          text-align: right;
        }
        .declaration {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          margin: 30px 0;
        }
        .signature-section {
          margin-top: 50px;
          padding-top: 30px;
          border-top: 2px solid #dee2e6;
        }
        .signature-line {
          width: 300px;
          height: 2px;
          background-color: #333;
          margin: 60px auto 10px;
        }
        .signature-text {
          text-align: center;
          color: #495057;
          font-size: 14px;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
          text-align: center;
          color: #6c757d;
          font-size: 13px;
        }
      </style>
    </head>
    <body>

      <div class="header">
        <img src="data:image/png;base64,${logoBase64}" class="logo" />
        <h2 style="color: #0b3954; margin: 10px 0;">CERTIFICADO DIGITAL</h2>
      </div>

      <div class="section">
        <h4>📋 Información de la Empresa</h4>
        <div class="info-row">
          <span class="label">Razón Social:</span>
          <span class="value">${empresa.nombre}</span>
        </div>
        <div class="info-row">
          <span class="label">NIT:</span>
          <span class="value">${empresa.nit}</span>
        </div>
        <div class="info-row">
          <span class="label">Dirección:</span>
          <span class="value">${empresa.direccion}</span>
        </div>
      </div>

      <div class="section">
        <h4>👤 Representante Legal</h4>
        <div class="info-row">
          <span class="label">Nombre Completo:</span>
          <span class="value">${admin.nombre}</span>
        </div>
        <div class="info-row">
          <span class="label">Teléfono:</span>
          <span class="value">${admin.telefono}</span>
        </div>
        <div class="info-row">
          <span class="label">Correo Electrónico:</span>
          <span class="value">${admin.correo}</span>
        </div>
      </div>

      <div class="declaration">
        <h4 style="color: #0b3954; margin-top: 0;">Declaración Juramentada</h4>
        <p style="text-align: justify; margin: 15px 0;">
          Yo, <strong>${admin.nombre}</strong>, identificado como representante legal de la empresa 
          <strong>${empresa.nombre}</strong>, con NIT <strong>${empresa.nit}</strong>, declaro bajo 
          la gravedad de juramento que:
        </p>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li>La información suministrada en este documento es verídica, completa y actualizada.</li>
          <li>Cuento con las facultades legales para representar a la empresa ante terceros.</li>
          <li>Acepto los términos y condiciones establecidos para la emisión del certificado digital.</li>
          <li>Me comprometo a utilizar el certificado de firma electrónica de conformidad con la normativa vigente.</li>
        </ul>
        <p style="text-align: justify; margin: 15px 0;">
          Solicito formalmente la emisión del certificado de firma digital para habilitar la facturación 
          electrónica en cumplimiento de las disposiciones establecidas por la DIAN según la Resolución 
          000165 de 2023.
        </p>
      </div>

      <div class="signature-section">
        <div class="signature-line"></div>
        <div class="signature-text">
          <strong>${admin.nombre}</strong><br/>
          Representante Legal<br/>
          ${empresa.nombre}<br/>
          NIT: ${empresa.nit}
        </div>
      </div>

      <div class="footer">
        <p><strong>SysPyME</strong> - Sistema de Facturación Electrónica</p>
        <p>Certificado generado el ${new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}</p>
        <p style="margin-top: 15px; font-size: 12px; color: #999;">
          Este documento certifica la solicitud de certificado digital para facturación electrónica
        </p>
      </div>

    </body>
    </html>
    `;

  return {
    html
  };
};