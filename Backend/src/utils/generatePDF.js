import xml2js from "xml2js";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generarQRBuffer(cufe) {
  try {
    const qrBuffer = await QRCode.toBuffer(cufe, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 300
    });
    return qrBuffer;
  } catch (err) {
    console.error("Error generando QR:", err);
    return null;
  }
}

function getNodeValue(node) {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (node._) return node._;
  return "";
}

function formatearNumero(numero) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero);
}

function obtenerLogoPath() {
  try {
    const logoPath = path.join(__dirname, '../assets/logo-syspyme.png');
    if (fs.existsSync(logoPath)) {
      return logoPath;
    }
    return null;
  } catch (err) {
    console.error("Error cargando logo:", err);
    return null;
  }
}

export async function generarPDFBuffer(xmlString) {
  const parser = new xml2js.Parser({ explicitArray: false });
  const data = await parser.parseStringPromise(xmlString);
  
  const factura = data.Invoice;
  const emisor = factura["cac:AccountingSupplierParty"];
  const cliente = factura["cac:AccountingCustomerParty"];
  const totales = factura["cac:LegalMonetaryTotal"];
  const lineas = factura["cac:InvoiceLine"];
  const cufe = factura["cbc:UUID"];
  const fecha = factura["cbc:IssueDate"];
  const hora = factura["cbc:IssueTime"];
  const totalLetra = (factura["cbc:StringNumber"]?._ || factura["cbc:StringNumber"] || 'No disponible').toUpperCase();
  
  const vendedor = emisor["cac:AccountingContact"];
  const taxSubtotal = factura["cac:TaxTotal"]["cac:TaxSubtotal"];
  const tasaIVA = taxSubtotal["cac:TaxCategory"]["cbc:Percent"] || "19";
  const productos = Array.isArray(lineas) ? lineas : [lineas];
  
  // Generar QR
  const qrBuffer = await generarQRBuffer(cufe);
  const logoPath = obtenerLogoPath();

  // Crear documento PDF
  const doc = new PDFDocument({ 
    size: 'LETTER',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });
  
  // Capturar el PDF en buffers
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  // Colores
  const primaryColor = '#2563eb';
  const lightGray = '#f3f4f6';
  const darkGray = '#374151';

  // Header con logo y título
  let yPos = 50;
  
  if (logoPath) {
    doc.image(logoPath, 50, yPos, { width: 80 });
  }
  
  doc.fontSize(20)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Factura Electrónica de Venta', 150, yPos, { align: 'left' });
  
  doc.fontSize(10)
     .fillColor(darkGray)
     .font('Helvetica')
     .text('Representación Impresa', 150, yPos + 25);

  yPos += 60;

  // Información de factura
  doc.fontSize(10)
     .font('Helvetica-Bold')
     .text(`Factura N°: `, 50, yPos, { continued: true })
     .font('Helvetica')
     .text(factura["cbc:ID"]);
  
  doc.font('Helvetica-Bold')
     .text(`Fecha: `, 300, yPos, { continued: true })
     .font('Helvetica')
     .text(`${fecha} ${hora}`);

  yPos += 30;

  // Sección Emisor
  doc.roundedRect(50, yPos, 250, 110, 5)
     .fillAndStroke(lightGray, darkGray);
  
  yPos += 10;
  
  doc.fontSize(12)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Emisor', 60, yPos);
  
  yPos += 20;
  
  doc.fontSize(9)
     .fillColor(darkGray)
     .font('Helvetica-Bold')
     .text('Razón Social: ', 60, yPos, { continued: true })
     .font('Helvetica')
     .text(emisor["cbc:Name"], { width: 230 });
  
  yPos += 20;
  
  doc.font('Helvetica-Bold')
     .text('NIT: ', 60, yPos, { continued: true })
     .font('Helvetica')
     .text(emisor["cbc:CompanyID"]);
  
  yPos += 15;
  
  doc.font('Helvetica-Bold')
     .text('Vendedor: ', 60, yPos, { continued: true })
     .font('Helvetica')
     .text(vendedor["cbc:Name"]);
  
  yPos += 15;
  
  doc.font('Helvetica-Bold')
     .text('Contacto: ', 60, yPos, { continued: true })
     .font('Helvetica')
     .text(vendedor["cbc:ElectronicMail"]);

  // Sección Cliente
  yPos -= 75;
  
  doc.roundedRect(320, yPos, 250, 110, 5)
     .fillAndStroke(lightGray, darkGray);
  
  yPos += 10;
  
  doc.fontSize(12)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Cliente', 330, yPos);
  
  yPos += 20;
  
  doc.fontSize(9)
     .fillColor(darkGray)
     .font('Helvetica-Bold')
     .text('Nombre: ', 330, yPos, { continued: true })
     .font('Helvetica')
     .text(cliente["cbc:Name"], { width: 220 });
  
  yPos += 20;
  
  doc.font('Helvetica-Bold')
     .text('Documento: ', 330, yPos, { continued: true })
     .font('Helvetica')
     .text(cliente["cbc:ID"]);
  
  yPos += 15;
  
  doc.font('Helvetica-Bold')
     .text('Correo: ', 330, yPos, { continued: true })
     .font('Helvetica')
     .text(cliente["cbc:Email"], { width: 220 });
  
  yPos += 15;
  
  doc.font('Helvetica-Bold')
     .text('Teléfono: ', 330, yPos, { continued: true })
     .font('Helvetica')
     .text(cliente["cbc:Phone"]);

  yPos += 95;

  // Tabla de productos
  doc.fontSize(12)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Detalle de productos', 50, yPos);
  
  yPos += 25;

  // Header de tabla
  doc.rect(50, yPos, 520, 25)
     .fillAndStroke(primaryColor, primaryColor);
  
  doc.fontSize(9)
     .fillColor('white')
     .font('Helvetica-Bold')
     .text('Código', 55, yPos + 8, { width: 60 })
     .text('Descripción', 120, yPos + 8, { width: 200 })
     .text('Cant.', 325, yPos + 8, { width: 50 })
     .text('Valor Unit.', 380, yPos + 8, { width: 80, align: 'right' })
     .text('Total', 465, yPos + 8, { width: 100, align: 'right' });

  yPos += 25;

  // Filas de productos
  productos.forEach((p, index) => {
    const bgColor = index % 2 === 0 ? '#ffffff' : lightGray;
    doc.rect(50, yPos, 520, 30).fill(bgColor);
    
    doc.fontSize(8)
       .fillColor(darkGray)
       .font('Helvetica')
       .text(p["cbc:Code"], 55, yPos + 8, { width: 60 })
       .text(p["cac:Item"]["cbc:Description"], 120, yPos + 8, { width: 200 })
       .text(p["cbc:InvoicedQuantity"], 325, yPos + 8, { width: 50 })
       .text(`$${formatearNumero(p["cac:Price"]["cbc:PriceAmount"]._)}`, 380, yPos + 8, { width: 80, align: 'right' })
       .text(`$${formatearNumero(p["cbc:LineExtensionAmount"]._)}`, 465, yPos + 8, { width: 100, align: 'right' });
    
    yPos += 30;
  });

  yPos += 10;

  // Información de pago y totales
  doc.fontSize(9)
     .fillColor(darkGray)
     .font('Helvetica-Bold')
     .text('Método de Pago: ', 50, yPos, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:PaymentMethod"]);

  doc.font('Helvetica-Bold')
     .text('Subtotal: ', 380, yPos, { continued: true })
     .font('Helvetica')
     .text(`$${formatearNumero(totales["cbc:LineExtensionAmount"]._)}`, { width: 185, align: 'right' });

  yPos += 15;

  doc.font('Helvetica-Bold')
     .text('Forma de Pago: ', 50, yPos, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:PaymentType"]);

  doc.font('Helvetica-Bold')
     .text(`IVA (${tasaIVA}%): `, 380, yPos, { continued: true })
     .font('Helvetica')
     .text(`$${formatearNumero(parseFloat(totales["cbc:PayableAmount"]._) - parseFloat(totales["cbc:TaxExclusiveAmount"]._))}`, { width: 185, align: 'right' });

  yPos += 15;

  doc.font('Helvetica-Bold')
     .text('Término: ', 50, yPos, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:FinalTerm"]);

  doc.fontSize(11)
     .font('Helvetica-Bold')
     .text('Total: ', 380, yPos, { continued: true })
     .text(`$${formatearNumero(totales["cbc:PayableAmount"]._)}`, { width: 185, align: 'right' });

  yPos += 25;

  // Total en letras
  doc.fontSize(9)
     .font('Helvetica-Oblique')
     .text(`${totalLetra} PESOS COLOMBIANOS`, 50, yPos, { width: 520, align: 'center' });

  yPos += 30;

  // QR y CUFE
  doc.fontSize(10)
     .font('Helvetica-Bold')
     .fillColor(primaryColor)
     .text('CUFE:', 50, yPos);

  yPos += 15;

  doc.fontSize(7)
     .fillColor(darkGray)
     .font('Helvetica')
     .text(cufe, 50, yPos, { width: 350 });

  if (qrBuffer) {
    doc.image(qrBuffer, 420, yPos - 15, { width: 150 });
  }

  yPos += 80;

  // Footer
  doc.fontSize(8)
     .fillColor(darkGray)
     .font('Helvetica')
     .text('Software: SysPyME | Fabricante: SYSPYME.ORG', 50, yPos, { width: 520, align: 'center' });

  yPos += 15;

  doc.fontSize(7)
     .text('Haciendo función y cumplimiento de la resolución 000012 del 9 de febrero del 2021, nos permitimos generar esta factura electrónica.', 
           50, yPos, { width: 520, align: 'center' });

  yPos += 20;

  doc.text(`© ${new Date().getFullYear()} Todos los derechos reservados.`, 50, yPos, { width: 520, align: 'center' });

  // Finalizar PDF
  doc.end();

  // Retornar el Buffer completo
  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
}

// Función adicional para guardar el PDF en disco si lo necesitas
export async function guardarPDFEnDisco(xmlString, outputPath) {
  const pdfBuffer = await generarPDFBuffer(xmlString);
  fs.writeFileSync(outputPath, pdfBuffer);
  return outputPath;
}