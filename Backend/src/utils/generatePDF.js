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
      width: 200
    });
    return qrBuffer;
  } catch (err) {
    console.error("Error generando QR:", err);
    return null;
  }
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

function dibujarCaja(doc, x, y, width, height, bgColor, borderColor, radius = 6) {
  doc.roundedRect(x, y, width, height, radius)
     .fillAndStroke(bgColor, borderColor)
     .lineWidth(1);
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
  
  const qrBuffer = await generarQRBuffer(cufe);
  const logoPath = obtenerLogoPath();

  const doc = new PDFDocument({ 
    size: 'LETTER',
    margins: { top: 40, bottom: 40, left: 40, right: 40 }
  });
  
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  const primaryColor = '#0b3954';
  const lightGray = '#fafafa';
  const borderColor = '#e0e0e0';
  const textGray = '#666';
  const darkText = '#333';
  const labelColor = '#555';

  let yPos = 40;

  // ==================== HEADER ====================
  if (logoPath) {
    doc.image(logoPath, 40, yPos, { width: 120, height: 48, fit: [120, 48] });
  }
  
  doc.fontSize(18)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Factura Electrónica de Venta', 200, yPos, { align: 'right' });
  
  doc.fontSize(12)
     .fillColor(darkText)
     .font('Helvetica')
     .text('Representación Impresa', 200, yPos + 23, { align: 'right' });

  yPos += 60;

  doc.moveTo(40, yPos)
     .lineTo(570, yPos)
     .lineWidth(3)
     .strokeColor(primaryColor)
     .stroke();

  yPos += 15;

  // ==================== ENCABEZADO FACTURA ====================
  dibujarCaja(doc, 40, yPos, 530, 32, lightGray, borderColor, 6);
  
  doc.fontSize(11)
     .fillColor(darkText)
     .font('Helvetica-Bold')
     .text('Factura N°: ', 50, yPos + 10);
  
  doc.font('Helvetica')
     .text(factura["cbc:ID"], 115, yPos + 10);
  
  doc.font('Helvetica-Bold')
     .text('Fecha de emisión: ', 240, yPos + 10);
  
  doc.font('Helvetica')
     .text(fecha, 345, yPos + 10);
  
  doc.font('Helvetica-Bold')
     .text('Hora de emisión:', 415, yPos + 10);
  
  doc.font('Helvetica')
     .text(hora, 500, yPos + 10);

  yPos += 47;

  // ==================== EMISOR Y CLIENTE ====================
  const colWidth = 255;
  const colGap = 20;
  const colHeight = 135;

  // EMISOR
  const emisorX = 40;
  const emisorY = yPos;
  
  dibujarCaja(doc, emisorX, emisorY, colWidth, colHeight, lightGray, borderColor, 6);
  
  doc.fontSize(13)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Emisor', emisorX + 12, emisorY + 10);
  
  doc.moveTo(emisorX + 12, emisorY + 26)
     .lineTo(emisorX + colWidth - 12, emisorY + 26)
     .lineWidth(2)
     .strokeColor(primaryColor)
     .stroke();

  let currentY = emisorY + 35;
  
  doc.fontSize(10)
     .fillColor(labelColor)
     .font('Helvetica-Bold')
     .text('Razon Social/Nombre: ', emisorX + 12, currentY, { width: colWidth - 24, continued: false });
  
  currentY += 13;
  
  doc.fillColor(darkText)
     .font('Helvetica')
     .text(emisor["cbc:Name"], emisorX + 12, currentY, { width: colWidth - 24 });
  
  currentY += 18;
  
  doc.fillColor(labelColor)
     .font('Helvetica-Bold')
     .text('NIT: ', emisorX + 12, currentY, { continued: true });
  
  doc.fillColor(darkText)
     .font('Helvetica')
     .text(emisor["cbc:CompanyID"]);

  currentY += 20;
  
  doc.moveTo(emisorX + 12, currentY)
     .lineTo(emisorX + colWidth - 12, currentY)
     .lineWidth(1)
     .strokeColor(borderColor)
     .stroke();
  
  currentY += 10;
  
  doc.fillColor(labelColor)
     .font('Helvetica-Bold')
     .text('Vendedor: ', emisorX + 12, currentY, { width: colWidth - 24, continued: false });
  
  currentY += 13;
  
  doc.fillColor(darkText)
     .font('Helvetica')
     .text(vendedor["cbc:Name"], emisorX + 12, currentY, { width: colWidth - 24 });
  
  currentY += 15;
  
  doc.fillColor(labelColor)
     .font('Helvetica-Bold')
     .text('Contactenos: ', emisorX + 12, currentY, { continued: true });
  
  doc.fillColor(darkText)
     .font('Helvetica')
     .text(vendedor["cbc:ElectronicMail"], { width: colWidth - 60 });

  // CLIENTE
  const clienteX = emisorX + colWidth + colGap;
  const clienteY = yPos;
  
  dibujarCaja(doc, clienteX, clienteY, colWidth, colHeight, lightGray, borderColor, 6);
  
  doc.fontSize(13)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Cliente', clienteX + 12, clienteY + 10);
  
  doc.moveTo(clienteX + 12, clienteY + 26)
     .lineTo(clienteX + colWidth - 12, clienteY + 26)
     .lineWidth(2)
     .strokeColor(primaryColor)
     .stroke();

  currentY = clienteY + 35;
  
  doc.fontSize(10)
     .fillColor(labelColor)
     .font('Helvetica-Bold')
     .text('Nombre: ', clienteX + 12, currentY, { width: colWidth - 24, continued: false });
  
  currentY += 13;
  
  doc.fillColor(darkText)
     .font('Helvetica')
     .text(cliente["cbc:Name"], clienteX + 12, currentY, { width: colWidth - 24 });
  
  currentY += 18;
  
  doc.fillColor(labelColor)
     .font('Helvetica-Bold')
     .text('Documento: ', clienteX + 12, currentY, { continued: true });
  
  doc.fillColor(darkText)
     .font('Helvetica')
     .text(cliente["cbc:ID"]);
  
  currentY += 15;
  
  doc.fillColor(labelColor)
     .font('Helvetica-Bold')
     .text('Correo: ', clienteX + 12, currentY, { width: colWidth - 24, continued: false });
  
  currentY += 13;
  
  doc.fillColor(darkText)
     .font('Helvetica')
     .text(cliente["cbc:Email"], clienteX + 12, currentY, { width: colWidth - 24 });
  
  currentY += 15;
  
  doc.fillColor(labelColor)
     .font('Helvetica-Bold')
     .text('Telefono: ', clienteX + 12, currentY, { continued: true });
  
  doc.fillColor(darkText)
     .font('Helvetica')
     .text(cliente["cbc:Phone"]);

  yPos += colHeight + 18;

  // ==================== TABLA ====================
  doc.fontSize(14)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Detalle de productos', 40, yPos);

  yPos += 22;

  const tableLeft = 40;
  const tableWidth = 530;
  
  const col1Width = tableWidth * 0.10;
  const col2Width = tableWidth * 0.40;
  const col3Width = tableWidth * 0.10;
  const col4Width = tableWidth * 0.20;
  const col5Width = tableWidth * 0.20;

  // Header
  doc.rect(tableLeft, yPos, tableWidth, 24)
     .fillAndStroke(primaryColor, primaryColor);
  
  doc.fontSize(10)
     .fillColor('white')
     .font('Helvetica-Bold')
     .text('Código', tableLeft + 5, yPos + 7, { width: col1Width - 10, align: 'left' })
     .text('Descripción', tableLeft + col1Width + 5, yPos + 7, { width: col2Width - 10, align: 'left' })
     .text('Cantid', tableLeft + col1Width + col2Width + 5, yPos + 7, { width: col3Width - 10, align: 'right' })
     .text('Valor Unitario', tableLeft + col1Width + col2Width + col3Width + 5, yPos + 7, { width: col4Width - 10, align: 'right' })
     .text('Total', tableLeft + col1Width + col2Width + col3Width + col4Width + 5, yPos + 7, { width: col5Width - 10, align: 'right' });

  yPos += 24;

  // Filas
  productos.forEach((p, index) => {
    const rowHeight = 24;
    const bgColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
    
    doc.rect(tableLeft, yPos, tableWidth, rowHeight)
       .fillAndStroke(bgColor, borderColor)
       .lineWidth(1);
    
    doc.fontSize(10)
       .fillColor(darkText)
       .font('Helvetica')
       .text(p["cbc:Code"] || '', tableLeft + 5, yPos + 7, { width: col1Width - 10, align: 'left' })
       .text(p["cac:Item"]["cbc:Description"] || '', tableLeft + col1Width + 5, yPos + 7, { width: col2Width - 10, align: 'left' })
       .text(p["cbc:InvoicedQuantity"] || '', tableLeft + col1Width + col2Width + 5, yPos + 7, { width: col3Width - 10, align: 'right' })
       .text(`$${formatearNumero(p["cac:Price"]["cbc:PriceAmount"]._)}`, tableLeft + col1Width + col2Width + col3Width + 5, yPos + 7, { width: col4Width - 10, align: 'right' })
       .text(`$${formatearNumero(p["cbc:LineExtensionAmount"]._)}`, tableLeft + col1Width + col2Width + col3Width + col4Width + 5, yPos + 7, { width: col5Width - 10, align: 'right' });
    
    yPos += rowHeight;
  });

  yPos += 15;

  // ==================== TOTALES ====================
  const totalesHeight = 75;
  dibujarCaja(doc, 40, yPos, 530, totalesHeight, lightGray, borderColor, 6);

  const totalesIzqX = 50;
  const totalesDerX = 320;
  let totalesY = yPos + 12;

  doc.fontSize(11)
     .fillColor(darkText)
     .font('Helvetica-Bold')
     .text('Método de Pago: ', totalesIzqX, totalesY, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:PaymentMethod"] || 'N/A');

  totalesY += 16;

  doc.font('Helvetica-Bold')
     .text('Forma de Pago: ', totalesIzqX, totalesY, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:PaymentType"] || 'N/A');

  totalesY += 16;

  doc.font('Helvetica-Bold')
     .text('Termino: ', totalesIzqX, totalesY, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:FinalTerm"] || '0');

  // Derecha
  totalesY = yPos + 12;

  doc.fontSize(11)
     .fillColor(darkText)
     .font('Helvetica-Bold')
     .text('Subtotal:', totalesDerX, totalesY, { width: 80, align: 'left' });
  
  doc.font('Helvetica')
     .text(`$${formatearNumero(totales["cbc:LineExtensionAmount"]._)}`, totalesDerX + 85, totalesY, { width: 145, align: 'right' });

  totalesY += 16;

  doc.font('Helvetica-Bold')
     .text(`IVA (${tasaIVA}%):`, totalesDerX, totalesY, { width: 80, align: 'left' });
  
  doc.font('Helvetica')
     .text(`$${formatearNumero(parseFloat(totales["cbc:PayableAmount"]._) - parseFloat(totales["cbc:TaxExclusiveAmount"]._))}`, totalesDerX + 85, totalesY, { width: 145, align: 'right' });

  totalesY += 20;

  doc.moveTo(totalesDerX, totalesY - 6)
     .lineTo(560, totalesY - 6)
     .lineWidth(2)
     .strokeColor(primaryColor)
     .stroke();

  doc.fontSize(13)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Total:', totalesDerX, totalesY, { width: 80, align: 'left' });
  
  doc.text(`$${formatearNumero(totales["cbc:PayableAmount"]._)}`, totalesDerX + 85, totalesY, { width: 145, align: 'right' });

  yPos += totalesHeight + 12;

  // Total en letras
  doc.fontSize(13)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text(totalLetra + ' PESOS COLOMBIANOS', 40, yPos, { width: 530, align: 'right' });

  yPos += 25;

  // ==================== CUFE Y QR ====================
  const cufeHeight = 95;
  dibujarCaja(doc, 40, yPos, 530, cufeHeight, lightGray, borderColor, 6);

  doc.fontSize(12)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('CUFE:', 50, yPos + 10);

  doc.fontSize(11)
     .fillColor(textGray)
     .font('Helvetica')
     .text(cufe, 50, yPos + 28, { width: 380, lineBreak: true, lineGap: 1.5 });

  if (qrBuffer) {
    doc.rect(480, yPos + 15, 65, 65).fillAndStroke('#ffffff', '#dddddd').lineWidth(1);
    doc.image(qrBuffer, 483, yPos + 18, { width: 59, height: 59 });
  }

  yPos += cufeHeight + 18;

  // ==================== FOOTER ====================
  doc.moveTo(40, yPos)
     .lineTo(570, yPos)
     .lineWidth(1)
     .strokeColor(borderColor)
     .stroke();

  yPos += 12;

  doc.fontSize(9)
     .fillColor('#999')
     .font('Helvetica')
     .text('Software: ', 40, yPos, { continued: true, width: 530, align: 'center' });
  
  doc.font('Helvetica-Bold')
     .fillColor(primaryColor)
     .text('SysPyME', { continued: true });
  
  doc.font('Helvetica')
     .fillColor('#999')
     .text(' | Fabricante: SYSPYME.ORG');

  yPos += 15;

  doc.fontSize(8)
     .text('Haciendo función y cumplimiento de la resolución 000012 del 9 de febrero del 2021, nos permitimos generar esta factura electrónica. También, siguiendo el título V de la resolución 42 del 5 de mayo del 2020, hacemos cumplimiento de los requisitos mínimos para los documentos referentes a la facturación electrónica.', 
           40, yPos, { width: 530, align: 'center', lineGap: 1.5 });

  yPos += 25;

  doc.fontSize(9)
     .text(`© ${new Date().getFullYear()} Todos los derechos reservados.`, 40, yPos, { width: 530, align: 'center' });

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
}

export async function guardarPDFEnDisco(xmlString, outputPath) {
  const pdfBuffer = await generarPDFBuffer(xmlString);
  fs.writeFileSync(outputPath, pdfBuffer);
  return outputPath;
}