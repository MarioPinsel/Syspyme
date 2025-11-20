import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { generarHTMLDesdeXML } from './generarHTMLDesdeXML.js';

export async function sendFacturaEmail(xmlString, clienteEmail) {
    const html = await generarHTMLDesdeXML(xmlString);

    // Lanzar navegador compatible con Azure
    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true
    });

    await browser.close();

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