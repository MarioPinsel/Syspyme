import nodemailer from 'nodemailer';
import html_to_pdf from 'html-pdf-node';
import { generarHTMLDesdeXML } from './generarHTMLDesdeXML.js';

export async function sendFacturaEmail(xmlString, clienteEmail) {
    const html = await generarHTMLDesdeXML(xmlString);

    const file = { content: html };

    const pdfBuffer = await html_to_pdf.generatePdf(file, {
        format: 'A4',
        printBackground: true
    });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"SysPyME" <${process.env.EMAIL_USER}>`,
        to: clienteEmail,
        subject: "Factura Electrónica - SysPyME",
        html: `
        <p>Estimado cliente,</p>
        <p>Adjuntamos su <b>Factura Electrónica</b> (PDF y XML).</p>
        `,
        attachments: [
            { filename: "Factura.pdf", content: pdfBuffer },
            { filename: "Factura.xml", content: xmlString }
        ]
    });

    console.log("Factura enviada correctamente a:", clienteEmail);
}
