import nodemailer from 'nodemailer';
import archiver from 'archiver';
import { generarPDFBuffer } from './generatePDF.js';

/**
 * Crea un buffer ZIP con los archivos PDF y XML
 */
async function crearZipBuffer(pdfBuffer, xmlString) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {
      zlib: { level: 9 } // Máxima compresión
    });

    const chunks = [];

    // Capturar los datos del ZIP en memoria
    archive.on('data', (chunk) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', (err) => reject(err));

    // Agregar archivos al ZIP
    archive.append(pdfBuffer, { name: `Factura.pdf` });
    archive.append(xmlString, { name: `Factura.xml` });

    // Finalizar el archivo ZIP
    archive.finalize();
  });
}

/**
 * Envía la factura por email con PDF y XML dentro de un ZIP
 */
export async function sendFacturaEmail(xmlString, clienteEmail) {
  try {
    // Generar PDF
    const pdfBuffer = await generarPDFBuffer(xmlString);
    
    // Crear ZIP con ambos archivos
    const zipBuffer = await crearZipBuffer(pdfBuffer, xmlString);
    
    // Configurar transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Opciones del correo
    const mailOptions = {
      from: `"SysPyME" <${process.env.EMAIL_USER}>`,
      to: clienteEmail,
      subject: `Factura Electrónica - SysPyME`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0b3954;">Factura Electrónica - SysPyME</h2>
          <p>Estimado cliente,</p>
          <p>Adjuntamos su <b>Factura Electrónica </b> en formato comprimido ZIP.</p>
          <p>El archivo contiene:</p>
          <ul>
            <li>Factura en formato <b>PDF</b> (para visualización e impresión)</li>
            <li>Factura en formato <b>XML</b> (documento oficial DIAN)</li>
          </ul>
          <p>Gracias por confiar en <b>SysPyME</b>.</p>
          <hr style="border: none; border-top: 2px solid #0b3954; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Este es un correo automático, por favor no responder. 
            Si tiene alguna consulta, contáctenos a través de nuestros canales oficiales.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `Factura.zip`,
          content: zipBuffer,
          contentType: 'application/zip'
        }
      ]
    };
    
    // Enviar correo
    await transporter.sendMail(mailOptions);
    console.log(`✅ Factura enviada correctamente a: ${clienteEmail}`);
    
    return { success: true, message: 'Factura enviada exitosamente' };
    
  } catch (error) {
    console.error('❌ Error al enviar factura:', error);
    throw new Error(`Error al enviar factura: ${error.message}`);
  }
}

    