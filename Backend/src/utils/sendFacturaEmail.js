import nodemailer from 'nodemailer';
import { generarHTMLDesdeXML } from './generarHTMLDesdeXML.js';

export async function sendFacturaEmail(xmlString, clienteEmail) {
    // 1. Generar HTML desde el XML
    const html = await generarHTMLDesdeXML(xmlString);

    // 2. Configurar transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 3. Opciones del correo
    const mailOptions = {
        from: `"SysPyME" <${process.env.EMAIL_USER}>`,
        to: clienteEmail,
        subject: "Factura Electrónica - SysPyME",
        html: `
            <p>Estimado cliente,</p>
            <p>Adjuntamos su <b>Factura Electrónica</b> en formato HTML y XML.</p>
            <p>Gracias por confiar en <b>SysPyME</b>.</p>
        `,
        attachments: [
            {
                filename: 'Factura.html',
                content: html,
                contentType: 'text/html'
            },
            {
                filename: 'Factura.xml',
                content: xmlString,
                contentType: 'application/xml'
            }
        ]
    };

    // 4. Enviar correo
    await transporter.sendMail(mailOptions);
    console.log("📨 Factura enviada correctamente a:", clienteEmail);
}