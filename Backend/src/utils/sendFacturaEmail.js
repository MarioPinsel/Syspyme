import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import { generarHTMLDesdeXML } from './generarHTMLDesdeXML.js';

export async function sendFacturaEmail(xmlString, clienteEmail) {
    // 1. Generar HTML desde el XML
    const html = await generarHTMLDesdeXML(xmlString);

    // 2. Crear PDF usando Puppeteer (compatible con Azure Linux)
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--no-zygote",
            "--single-process"
        ]
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true
    });

    await browser.close();

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
            {
                filename: 'Factura.pdf',
                content: pdfBuffer,
                contentType: 'application/pdf'
            },
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

    // 5. Enviar correo
    await transporter.sendMail(mailOptions);
    console.log("📨 Factura enviada correctamente a:", clienteEmail);
}
