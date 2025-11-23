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
    margins: { top: 40, bottom: 40, left: 40, right: 40 }
  });
  
  // Capturar el PDF en buffers
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  // Colores basados en el HTML
  const primaryColor = '#0b3954';
  const lightGray = '#fafafa';
  const borderColor = '#e0e0e0';
  const textGray = '#666';
  const darkText = '#333';

  let yPos = 50;

  // Header con logo y título (con línea inferior)
  if (logoPath) {
    doc.image(logoPath, 40, yPos, { width: 100, height: 40, fit: [100, 40] });
  }
  
  doc.fontSize(18)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Factura Electrónica de Venta', 200, yPos, { align: 'right' });
  
  doc.fontSize(12)
     .fillColor(darkText)
     .font('Helvetica')
     .text('Representación Impresa', 200, yPos + 22, { align: 'right' });

  yPos += 50;

  // Línea separadora azul gruesa
  doc.moveTo(40, yPos)
     .lineTo(570, yPos)
     .lineWidth(3)
     .strokeColor(primaryColor)
     .stroke();

  yPos += 15;

  // Encabezado de factura (fondo gris claro con borde)
  doc.roundedRect(40, yPos, 530, 30, 6)
     .fillAndStroke(lightGray, borderColor);
  
  doc.fontSize(11)
     .fillColor(darkText)
     .font('Helvetica-Bold')
     .text('Factura N°: ', 50, yPos + 10, { continued: true })
     .font('Helvetica')
     .text(factura["cbc:ID"]);
  
  doc.font('Helvetica-Bold')
     .text('Fecha de emisión: ', 250, yPos + 10, { continued: true })
     .font('Helvetica')
     .text(`${fecha}  `, { continued: true });
  
  doc.font('Helvetica-Bold')
     .text('Hora de emisión: ', { continued: true })
     .font('Helvetica')
     .text(hora);

  yPos += 45;

  // Grid de dos columnas: Emisor y Cliente
  const colWidth = 255;
  const colGap = 20;

  // EMISOR (Columna izquierda)
  const emisorX = 40;
  const emisorY = yPos;
  
  doc.roundedRect(emisorX, emisorY, colWidth, 130, 6)
     .fillAndStroke(lightGray, borderColor);
  
  doc.fontSize(13)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Emisor', emisorX + 10, emisorY + 10);
  
  // Línea debajo del título Emisor
  doc.moveTo(emisorX + 10, emisorY + 25)
     .lineTo(emisorX + colWidth - 10, emisorY + 25)
     .lineWidth(2)
     .strokeColor(primaryColor)
     .stroke();

  let emisorYPos = emisorY + 35;
  
  doc.fontSize(11)
     .fillColor('#555')
     .font('Helvetica-Bold')
     .text('Razon Social/Nombre: ', emisorX + 10, emisorYPos, { continued: true, width: colWidth - 20 })
     .fillColor(darkText)
     .font('Helvetica')
     .text(emisor["cbc:Name"], { width: colWidth - 20 });
  
  emisorYPos += 20;
  
  doc.fillColor('#555')
     .font('Helvetica-Bold')
     .text('NIT: ', emisorX + 10, emisorYPos, { continued: true })
     .fillColor(darkText)
     .font('Helvetica')
     .text(emisor["cbc:CompanyID"]);

  emisorYPos += 20;
  
  // Línea separadora para vendedor
  doc.moveTo(emisorX + 10, emisorYPos)
     .lineTo(emisorX + colWidth - 10, emisorYPos)
     .lineWidth(1)
     .strokeColor(borderColor)
     .stroke();
  
  emisorYPos += 10;
  
  doc.fillColor('#555')
     .font('Helvetica-Bold')
     .text('Vendedor: ', emisorX + 10, emisorYPos, { continued: true })
     .fillColor(darkText)
     .font('Helvetica')
     .text(vendedor["cbc:Name"], { width: colWidth - 20 });
  
  emisorYPos += 15;
  
  doc.fillColor('#555')
     .font('Helvetica-Bold')
     .text('Contactenos: ', emisorX + 10, emisorYPos, { continued: true })
     .fillColor(darkText)
     .font('Helvetica')
     .text(vendedor["cbc:ElectronicMail"], { width: colWidth - 20 });

  // CLIENTE (Columna derecha)
  const clienteX = emisorX + colWidth + colGap;
  const clienteY = yPos;
  
  doc.roundedRect(clienteX, clienteY, colWidth, 130, 6)
     .fillAndStroke(lightGray, borderColor);
  
  doc.fontSize(13)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Cliente', clienteX + 10, clienteY + 10);
  
  // Línea debajo del título Cliente
  doc.moveTo(clienteX + 10, clienteY + 25)
     .lineTo(clienteX + colWidth - 10, clienteY + 25)
     .lineWidth(2)
     .strokeColor(primaryColor)
     .stroke();

  let clienteYPos = clienteY + 35;
  
  doc.fontSize(11)
     .fillColor('#555')
     .font('Helvetica-Bold')
     .text('Nombre: ', clienteX + 10, clienteYPos, { continued: true, width: colWidth - 20 })
     .fillColor(darkText)
     .font('Helvetica')
     .text(cliente["cbc:Name"], { width: colWidth - 20 });
  
  clienteYPos += 20;
  
  doc.fillColor('#555')
     .font('Helvetica-Bold')
     .text('Documento: ', clienteX + 10, clienteYPos, { continued: true })
     .fillColor(darkText)
     .font('Helvetica')
     .text(cliente["cbc:ID"]);
  
  clienteYPos += 15;
  
  doc.fillColor('#555')
     .font('Helvetica-Bold')
     .text('Correo: ', clienteX + 10, clienteYPos, { continued: true, width: colWidth - 20 })
     .fillColor(darkText)
     .font('Helvetica')
     .text(cliente["cbc:Email"], { width: colWidth - 20 });
  
  clienteYPos += 15;
  
  doc.fillColor('#555')
     .font('Helvetica-Bold')
     .text('Telefono: ', clienteX + 10, clienteYPos, { continued: true })
     .fillColor(darkText)
     .font('Helvetica')
     .text(cliente["cbc:Phone"]);

  yPos += 145;

  // Título "Detalle de productos"
  doc.fontSize(14)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Detalle de productos', 40, yPos);

  yPos += 20;

  // Tabla de productos
  const tableTop = yPos;
  const tableLeft = 40;
  const tableWidth = 530;
  
  // Anchos de columna (porcentajes convertidos a píxeles)
  const col1Width = tableWidth * 0.10; // Código
  const col2Width = tableWidth * 0.40; // Descripción
  const col3Width = tableWidth * 0.10; // Cantidad
  const col4Width = tableWidth * 0.20; // Valor Unitario
  const col5Width = tableWidth * 0.20; // Total

  // Header de tabla
  doc.rect(tableLeft, tableTop, tableWidth, 25)
     .fillAndStroke(primaryColor, primaryColor);
  
  doc.fontSize(10)
     .fillColor('white')
     .font('Helvetica-Bold')
     .text('Código', tableLeft + 5, tableTop + 8, { width: col1Width - 10, align: 'left' })
     .text('Descripción', tableLeft + col1Width + 5, tableTop + 8, { width: col2Width - 10, align: 'left' })
     .text('Cantidad', tableLeft + col1Width + col2Width + 5, tableTop + 8, { width: col3Width - 10, align: 'right' })
     .text('Valor Unitario', tableLeft + col1Width + col2Width + col3Width + 5, tableTop + 8, { width: col4Width - 10, align: 'right' })
     .text('Total', tableLeft + col1Width + col2Width + col3Width + col4Width + 5, tableTop + 8, { width: col5Width - 10, align: 'right' });

  let rowY = tableTop + 25;

  // Filas de productos
  productos.forEach((p, index) => {
    const rowHeight = 25;
    const bgColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
    
    doc.rect(tableLeft, rowY, tableWidth, rowHeight)
       .fillAndStroke(bgColor, borderColor);
    
    doc.fontSize(10)
       .fillColor(darkText)
       .font('Helvetica')
       .text(p["cbc:Code"] || '', tableLeft + 5, rowY + 8, { width: col1Width - 10, align: 'left' })
       .text(p["cac:Item"]["cbc:Description"] || '', tableLeft + col1Width + 5, rowY + 8, { width: col2Width - 10, align: 'left' })
       .text(p["cbc:InvoicedQuantity"] || '', tableLeft + col1Width + col2Width + 5, rowY + 8, { width: col3Width - 10, align: 'right' })
       .text(`$${formatearNumero(p["cac:Price"]["cbc:PriceAmount"]._)}`, tableLeft + col1Width + col2Width + col3Width + 5, rowY + 8, { width: col4Width - 10, align: 'right' })
       .text(`$${formatearNumero(p["cbc:LineExtensionAmount"]._)}`, tableLeft + col1Width + col2Width + col3Width + col4Width + 5, rowY + 8, { width: col5Width - 10, align: 'right' });
    
    rowY += rowHeight;
  });

  yPos = rowY + 15;

  // Sección de totales (fondo gris con borde redondeado)
  const totalesHeight = 70;
  doc.roundedRect(40, yPos, 530, totalesHeight, 6)
     .fillAndStroke(lightGray, borderColor);

  const totalesIzqX = 50;
  const totalesDerX = 320;
  let totalesY = yPos + 15;

  // Totales izquierda
  doc.fontSize(11)
     .fillColor(darkText)
     .font('Helvetica-Bold')
     .text('Método de Pago: ', totalesIzqX, totalesY, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:PaymentMethod"] || 'N/A');

  totalesY += 15;

  doc.font('Helvetica-Bold')
     .text('Forma de Pago: ', totalesIzqX, totalesY, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:PaymentType"] || 'N/A');

  totalesY += 15;

  doc.font('Helvetica-Bold')
     .text('Termino: ', totalesIzqX, totalesY, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:FinalTerm"] || '0');

  // Totales derecha
  totalesY = yPos + 15;

  doc.font('Helvetica-Bold')
     .text('Subtotal: ', totalesDerX, totalesY, { continued: true, width: 100 })
     .font('Helvetica')
     .text(`$${formatearNumero(totales["cbc:LineExtensionAmount"]._)}`, { width: 140, align: 'right' });

  totalesY += 15;

  doc.font('Helvetica-Bold')
     .text(`IVA (${tasaIVA}%): `, totalesDerX, totalesY, { continued: true, width: 100 })
     .font('Helvetica')
     .text(`$${formatearNumero(parseFloat(totales["cbc:PayableAmount"]._) - parseFloat(totales["cbc:TaxExclusiveAmount"]._))}`, { width: 140, align: 'right' });

  totalesY += 15;

  doc.fontSize(13)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Total: ', totalesDerX, totalesY, { continued: true, width: 100 })
     .text(`$${formatearNumero(totales["cbc:PayableAmount"]._)}`, { width: 140, align: 'right' });

  yPos += totalesHeight + 15;

  // Total en letras (negrita y azul)
  doc.fontSize(13)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text(totalLetra + ' PESOS COLOMBIANOS', 40, yPos, { width: 530, align: 'right' });

  yPos += 25;

  // CUFE y QR (fondo gris con borde redondeado)
  const cufeHeight = 90;
  doc.roundedRect(40, yPos, 530, cufeHeight, 6)
     .fillAndStroke(lightGray, borderColor);

  doc.fontSize(12)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('CUFE:', 50, yPos + 10);

  doc.fontSize(11)
     .fillColor(textGray)
     .font('Helvetica')
     .text(cufe, 50, yPos + 30, { width: 380, lineBreak: true });

  if (qrBuffer) {
    doc.image(qrBuffer, 480, yPos + 15, { width: 60, height: 60 });
  }

  yPos += cufeHeight + 20;

  // Footer (centrado, texto gris pequeño)
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
           40, yPos, { width: 530, align: 'center', lineGap: 2 });

  yPos += 25;

  doc.text(`© ${new Date().getFullYear()} Todos los derechos reservados.`, 40, yPos, { width: 530, align: 'center' });

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