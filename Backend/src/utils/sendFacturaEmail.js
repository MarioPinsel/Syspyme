import { chromium } from 'playwright';
import nodemailer from 'nodemailer';
import { generarHTMLDesdeXML } from './generarHTMLDesdeXML.js';

export async function sendFacturaEmail(xmlString, clienteEmail) {
    try {
        // 1. Convertir XML → HTML
        const html = await generarHTMLDesdeXML(xmlString);

        // 2. Generar PDF con Playwright
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        // Cargar el HTML
        await page.setContent(html, { waitUntil: 'load' });

        // Crear el PDF en memoria (Buffer)
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        await browser.close();

        // 3. Configurar correo con nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // 4. Enviar el correo
        await transporter.sendMail({
            from: `"Syspyme" <${process.env.SMTP_USER}>`,
            to: clienteEmail,
            subject: "Factura Electrónica",
            text: "Adjuntamos su factura electrónica.",
            attachments: [
                {
                    filename: "factura.pdf",
                    content: pdfBuffer
                }
            ]
        });

        console.log("Correo enviado correctamente.");
        return { ok: true, mensaje: "Factura enviada" };

    } catch (e) {
        console.error("Error enviando factura:", e);
        return { ok: false, error: e.message };
    }
}
