import nodemailer from 'nodemailer';
import wkhtmltopdf from 'wkhtmltopdf';
import { generarHTMLDesdeXML } from './generarHTMLDesdeXML.js';

export async function sendFacturaEmail(xmlString, clienteEmail) {

    // 1. Generar HTML desde el XML
    const html = await generarHTMLDesdeXML(xmlString);

    // 2. Convertir HTML → PDF (sin navegador)
    const pdfBuffer = await new Promise((resolve, reject) => {
        wkhtmltopdf(html, {
            pageSize: 'A4',
            printMediaType: true,
            enableLocalFileAccess: true,
            javascriptDelay: 150
        }, (err, stream) => {
            if (err) return reject(err);

            const chunks = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
    });

    // 3. Configurar transporter
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
            <p>Adjuntamos su <b>Factura Electrónica</b> en formato PDF, HTML y XML.</p>
            <p>Gracias por confiar en <b>SysPyME</b>.</p>
        `,
        attachments: [
            { filename: 'Factura.pdf', content: pdfBuffer },
            { filename: 'Factura.html', content: html, contentType: 'text/html' },
            { filename: 'Factura.xml', content: xmlString, contentType: 'application/xml' }
        ]
    };

    // 5. Enviar correo
    await transporter.sendMail(mailOptions);

    console.log("📨 Factura enviada correctamente a:", clienteEmail);
}
