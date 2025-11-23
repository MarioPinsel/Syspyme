import nodemailer from 'nodemailer';
//import { generarHTMLDesdeXML } from './generarHTMLDesdeXML.js';
import {generarPDFBuffer} from './generatePDF.js'

export async function sendFacturaEmail(xmlString, clienteEmail) {    
    const pdfBuffer = await generarPDFBuffer(xmlString);

    // 3. Configurar transporter (usando tus variables de entorno)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 4. Opciones del correo
    const mailOptions = {
        from: `"SysPyME" <${process.env.EMAIL_USER}>`,
        to: clienteEmail,
        subject: "Factura Electrónica - SysPyME",
        html: `
      <p>Estimado cliente,</p>
      <p>Adjuntamos su <b>Factura Electrónica</b> en formato PDF y XML.</p>
      <p>Gracias por confiar en <b>SysPyME</b>.</p>
    `,
        attachments: [
            { filename: 'Factura.pdf', content: pdfBuffer },
            { filename: 'Factura.xml', content: xmlString }
        ]
    };

    // 5. Enviar correo
    await transporter.sendMail(mailOptions);
    console.log("✅ Factura enviada correctamente a:", clienteEmail);
}