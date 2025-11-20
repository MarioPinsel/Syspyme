import nodemailer from 'nodemailer';
import { chromium } from 'playwright';
import { generarHTMLDesdeXML } from './generarHTMLDesdeXML.js';

export async function sendFacturaEmail(xmlString, clienteEmail) {
    // 1. Generar HTML
    const html = await generarHTMLDesdeXML(xmlString);

    // 2. Crear PDF con Playwright
    const browser = await chromium.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true
    });

    await browser.close();

    // 3. Enviar correo
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
            <p>Adjuntamos su <b>Factura Electrónica</b> en formato PDF y XML.</p>
        `,
        attachments: [
            { filename: 'Factura.pdf', content: pdfBuffer },
            { filename: 'Factura.xml', content: xmlString }
        ]
    });
    console.log("Factura enviada a:", clienteEmail);
}