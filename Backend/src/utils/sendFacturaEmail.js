import nodemailer from 'nodemailer';
import archiver from 'archiver';
import { generarPDFBuffer } from './generatePDF.js';

/**
 * ------------------------------------------------------
 *  CREA UN BUFFER ZIP CON PDF Y XML
 * ------------------------------------------------------
 */
async function crearZipBuffer(pdfBuffer, xmlString) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });

    const chunks = [];

    // Captura de datos del ZIP
    archive.on('data', (chunk) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', (err) => reject(err));

    // Validaciones
    if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
      return reject(new Error("pdfBuffer inválido."));
    }
    if (!xmlString || typeof xmlString !== 'string') {
      return reject(new Error("xmlString inválido."));
    }

    archive.append(pdfBuffer, { name: 'Factura.pdf' });
    archive.append(xmlString, { name: 'Factura.xml' });

    archive.finalize();
  });
}

/**
 * ------------------------------------------------------
 *  ENVÍA LA FACTURA POR EMAIL (PDF + XML dentro de ZIP)
 * ------------------------------------------------------
 */
export async function sendFacturaEmail(xmlString, clienteEmail) {
  try {
    if (!xmlString || typeof xmlString !== 'string') {
      throw new Error("XML inválido para generar factura.");
    }

    if (!clienteEmail) {
      throw new Error("El correo del cliente es obligatorio.");
    }

    const pdfBuffer = await generarPDFBuffer(xmlString);

    const zipBuffer = await crearZipBuffer(pdfBuffer, xmlString);

    // Valida que existan variables de entorno
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL_USER o EMAIL_PASS no están configurados en el entorno.");
    }

    // Transporter Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verificar conexión con Gmail
    await transporter.verify();

    const mailOptions = {
      from: `"SysPyME" <${process.env.EMAIL_USER}>`,
      to: clienteEmail,
      subject: "Factura Electrónica - SysPyME",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0b3954;">Factura Electrónica - SysPyME</h2>
          <p>Estimado cliente,</p>
          <p>Adjuntamos su <b>Factura Electrónica</b> en formato ZIP.</p>
          <p>El archivo contiene:</p>
          <ul>
            <li>Factura en PDF</li>
            <li>Factura en XML (formato DIAN)</li>
          </ul>
          <p>Gracias por confiar en <b>SysPyME</b>.</p>

          <hr style="border: none; border-top: 2px solid #0b3954; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Este es un correo automático, por favor no responder.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: 'Factura.zip',
          content: zipBuffer,
          contentType: 'application/zip'
        }
      ]
    };
    
    await transporter.sendMail(mailOptions);

    console.log(`✅ Factura enviada correctamente a: ${clienteEmail}`);

    return { success: true, message: "Factura enviada exitosamente" };

  } catch (error) {
    console.error("❌ Error al enviar factura:", error);
    throw new Error(`Error al enviar factura: ${error.message}`);
  }
}
