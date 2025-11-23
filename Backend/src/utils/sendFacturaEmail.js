import nodemailer from 'nodemailer';
import pdf from 'html-pdf';
import { generarHTMLDesdeXML } from './generarHTMLDesdeXML.js';

export async function sendFacturaEmail(xmlString, clienteEmail) {
    // 1. Generar HTML desde el XML
    const html = await generarHTMLDesdeXML(xmlString);

    // 2. Crear el PDF usando html-pdf
    const pdfBuffer = await new Promise((resolve, reject) => {
        const options = {
            format: 'A4',
            border: {
                top: '20mm',
                bottom: '20mm',
                left: '15mm',
                right: '15mm'
            }
        };

        pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) return reject(err);
            resolve(buffer);
        });
    });

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
            { filename: 'Factura.xml', content: xmlString, contentType: 'application/xml' }
        ]
    };

    // 5. Enviar correo
    await transporter.sendMail(mailOptions);
    console.log("✅ Factura enviada correctamente a:", clienteEmail);
}
