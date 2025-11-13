import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import { generarHTMLDesdeXML } from './generarHTMLDesdeXML.js';

export async function sendFacturaEmail(xmlString, clienteEmail) {
    // 1. Generar HTML desde el XML
    const html = await generarHTMLDesdeXML(xmlString);

    // 2. Crear el PDF usando Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

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
        subject: "🧾 Factura Electrónica - SysPyME",
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
