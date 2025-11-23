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

// Función auxiliar para dibujar caja con fondo y borde
function dibujarCaja(doc, x, y, width, height, bgColor, borderColor, radius = 6) {
  doc.roundedRect(x, y, width, height, radius)
     .fillAndStroke(bgColor, borderColor)
     .lineWidth(1);
}

// Función auxiliar para texto con label y valor
function textoLabelValor(doc, x, y, label, valor, width, labelColor = '#555', valorColor = '#333') {
  doc.fontSize(11)
     .fillColor(labelColor)
     .font('Helvetica-Bold')
     .text(label, x, y, { continued: true, width: width });
  
  doc.fillColor(valorColor)
     .font('Helvetica')
     .text(valor, { width: width });
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

  // Colores exactos del HTML
  const primaryColor = '#0b3954';
  const lightGray = '#fafafa';
  const borderColor = '#e0e0e0';
  const textGray = '#666';
  const darkText = '#333';
  const labelColor = '#555';

  let yPos = 40;

  // ==================== HEADER CON LOGO Y TÍTULO ====================
  if (logoPath) {
    doc.image(logoPath, 40, yPos, { width: 120, height: 48, fit: [120, 48] });
  }
  
  doc.fontSize(20)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Factura Electrónica de Venta', 200, yPos, { align: 'right' });
  
  doc.fontSize(14)
     .fillColor(darkText)
     .font('Helvetica')
     .text('Representación Impresa', 200, yPos + 25, { align: 'right' });

  yPos += 60;

  // Línea separadora azul gruesa (3px)
  doc.moveTo(40, yPos)
     .lineTo(570, yPos)
     .lineWidth(3)
     .strokeColor(primaryColor)
     .stroke();

  yPos += 15;

  // ==================== ENCABEZADO DE FACTURA ====================
  dibujarCaja(doc, 40, yPos, 530, 35, lightGray, borderColor, 6);
  
  doc.fontSize(13)
     .fillColor(darkText)
     .font('Helvetica-Bold')
     .text('Factura N°: ', 50, yPos + 12, { continued: true })
     .font('Helvetica')
     .text(factura["cbc:ID"]);
  
  doc.font('Helvetica-Bold')
     .text('Fecha de emisión: ', 280, yPos + 12, { continued: true })
     .font('Helvetica')
     .text(`${fecha}  `);
  
  doc.font('Helvetica-Bold')
     .text('Hora de emisión: ', 430, yPos + 12, { continued: true })
     .font('Helvetica')
     .text(hora);

  yPos += 50;

  // ==================== GRID DOS COLUMNAS: EMISOR Y CLIENTE ====================
  const colWidth = 255;
  const colGap = 20;
  const colHeight = 155;

  // EMISOR (Columna izquierda)
  const emisorX = 40;
  const emisorY = yPos;
  
  dibujarCaja(doc, emisorX, emisorY, colWidth, colHeight, lightGray, borderColor, 6);
  
  doc.fontSize(14)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Emisor', emisorX + 12, emisorY + 12);
  
  // Línea debajo del título Emisor (2px azul)
  doc.moveTo(emisorX + 12, emisorY + 28)
     .lineTo(emisorX + colWidth - 12, emisorY + 28)
     .lineWidth(2)
     .strokeColor(primaryColor)
     .stroke();

  let emisorYPos = emisorY + 38;
  
  textoLabelValor(doc, emisorX + 12, emisorYPos, 'Razon Social/Nombre: ', emisor["cbc:Name"], colWidth - 24, labelColor, darkText);
  
  emisorYPos += 22;
  
  textoLabelValor(doc, emisorX + 12, emisorYPos, 'NIT: ', emisor["cbc:CompanyID"], colWidth - 24, labelColor, darkText);

  emisorYPos += 30;
  
  // Línea separadora para vendedor
  doc.moveTo(emisorX + 12, emisorYPos)
     .lineTo(emisorX + colWidth - 12, emisorYPos)
     .lineWidth(1)
     .strokeColor(borderColor)
     .stroke();
  
  emisorYPos += 12;
  
  textoLabelValor(doc, emisorX + 12, emisorYPos, 'Vendedor: ', vendedor["cbc:Name"], colWidth - 24, labelColor, darkText);
  
  emisorYPos += 18;
  
  textoLabelValor(doc, emisorX + 12, emisorYPos, 'Contactenos: ', vendedor["cbc:ElectronicMail"], colWidth - 24, labelColor, darkText);

  // CLIENTE (Columna derecha)
  const clienteX = emisorX + colWidth + colGap;
  const clienteY = yPos;
  
  dibujarCaja(doc, clienteX, clienteY, colWidth, colHeight, lightGray, borderColor, 6);
  
  doc.fontSize(14)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Cliente', clienteX + 12, clienteY + 12);
  
  // Línea debajo del título Cliente (2px azul)
  doc.moveTo(clienteX + 12, clienteY + 28)
     .lineTo(clienteX + colWidth - 12, clienteY + 28)
     .lineWidth(2)
     .strokeColor(primaryColor)
     .stroke();

  let clienteYPos = clienteY + 38;
  
  textoLabelValor(doc, clienteX + 12, clienteYPos, 'Nombre: ', cliente["cbc:Name"], colWidth - 24, labelColor, darkText);
  
  clienteYPos += 22;
  
  textoLabelValor(doc, clienteX + 12, clienteYPos, 'Documento: ', cliente["cbc:ID"], colWidth - 24, labelColor, darkText);
  
  clienteYPos += 18;
  
  textoLabelValor(doc, clienteX + 12, clienteYPos, 'Correo: ', cliente["cbc:Email"], colWidth - 24, labelColor, darkText);
  
  clienteYPos += 18;
  
  textoLabelValor(doc, clienteX + 12, clienteYPos, 'Telefono: ', cliente["cbc:Phone"], colWidth - 24, labelColor, darkText);

  yPos += colHeight + 20;

  // ==================== TÍTULO DETALLE DE PRODUCTOS ====================
  doc.fontSize(16)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Detalle de productos', 40, yPos);

  yPos += 25;

  // ==================== TABLA DE PRODUCTOS ====================
  const tableTop = yPos;
  const tableLeft = 40;
  const tableWidth = 530;
  
  // Anchos de columna (exactos del HTML)
  const col1Width = tableWidth * 0.10; // Código
  const col2Width = tableWidth * 0.40; // Descripción
  const col3Width = tableWidth * 0.10; // Cantidad
  const col4Width = tableWidth * 0.20; // Valor Unitario
  const col5Width = tableWidth * 0.20; // Total

  // Header de tabla (fondo azul)
  doc.rect(tableLeft, tableTop, tableWidth, 26)
     .fillAndStroke(primaryColor, primaryColor);
  
  doc.fontSize(12)
     .fillColor('white')
     .font('Helvetica-Bold')
     .text('Código', tableLeft + 6, tableTop + 8, { width: col1Width - 12, align: 'left' })
     .text('Descripción', tableLeft + col1Width + 6, tableTop + 8, { width: col2Width - 12, align: 'left' })
     .text('Cantidad', tableLeft + col1Width + col2Width + 6, tableTop + 8, { width: col3Width - 12, align: 'right' })
     .text('Valor Unitario', tableLeft + col1Width + col2Width + col3Width + 6, tableTop + 8, { width: col4Width - 12, align: 'right' })
     .text('Total', tableLeft + col1Width + col2Width + col3Width + col4Width + 6, tableTop + 8, { width: col5Width - 12, align: 'right' });

  let rowY = tableTop + 26;

  // Filas de productos (alternando colores)
  productos.forEach((p, index) => {
    const rowHeight = 26;
    const bgColor = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
    
    doc.rect(tableLeft, rowY, tableWidth, rowHeight)
       .fillAndStroke(bgColor, borderColor)
       .lineWidth(1);
    
    doc.fontSize(12)
       .fillColor(darkText)
       .font('Helvetica')
       .text(p["cbc:Code"] || '', tableLeft + 6, rowY + 8, { width: col1Width - 12, align: 'left' })
       .text(p["cac:Item"]["cbc:Description"] || '', tableLeft + col1Width + 6, rowY + 8, { width: col2Width - 12, align: 'left' })
       .text(p["cbc:InvoicedQuantity"] || '', tableLeft + col1Width + col2Width + 6, rowY + 8, { width: col3Width - 12, align: 'right' })
       .text(`$${formatearNumero(p["cac:Price"]["cbc:PriceAmount"]._)}`, tableLeft + col1Width + col2Width + col3Width + 6, rowY + 8, { width: col4Width - 12, align: 'right' })
       .text(`$${formatearNumero(p["cbc:LineExtensionAmount"]._)}`, tableLeft + col1Width + col2Width + col3Width + col4Width + 6, rowY + 8, { width: col5Width - 12, align: 'right' });
    
    rowY += rowHeight;
  });

  yPos = rowY + 15;

  // ==================== SECCIÓN DE TOTALES ====================
  const totalesHeight = 80;
  dibujarCaja(doc, 40, yPos, 530, totalesHeight, lightGray, borderColor, 6);

  const totalesIzqX = 52;
  const totalesDerX = 340;
  let totalesY = yPos + 15;

  // Totales izquierda
  doc.fontSize(13)
     .fillColor(darkText)
     .font('Helvetica-Bold')
     .text('Método de Pago: ', totalesIzqX, totalesY, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:PaymentMethod"] || 'N/A');

  totalesY += 18;

  doc.font('Helvetica-Bold')
     .text('Forma de Pago: ', totalesIzqX, totalesY, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:PaymentType"] || 'N/A');

  totalesY += 18;

  doc.font('Helvetica-Bold')
     .text('Termino: ', totalesIzqX, totalesY, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:FinalTerm"] || '0');

  // Totales derecha
  totalesY = yPos + 15;

  doc.font('Helvetica-Bold')
     .text('Subtotal: ', totalesDerX, totalesY, { continued: true, width: 80 })
     .font('Helvetica')
     .text(`$${formatearNumero(totales["cbc:LineExtensionAmount"]._)}`, { width: 150, align: 'right' });

  totalesY += 18;

  doc.font('Helvetica-Bold')
     .text(`IVA (${tasaIVA}%): `, totalesDerX, totalesY, { continued: true, width: 80 })
     .font('Helvetica')
     .text(`$${formatearNumero(parseFloat(totales["cbc:PayableAmount"]._) - parseFloat(totales["cbc:TaxExclusiveAmount"]._))}`, { width: 150, align: 'right' });

  totalesY += 25;

  // Línea superior antes del total (2px azul)
  doc.moveTo(totalesDerX, totalesY - 10)
     .lineTo(570 - 12, totalesY - 10)
     .lineWidth(2)
     .strokeColor(primaryColor)
     .stroke();

  doc.fontSize(15)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('Total: ', totalesDerX, totalesY, { continued: true, width: 80 })
     .text(`$${formatearNumero(totales["cbc:PayableAmount"]._)}`, { width: 150, align: 'right' });

  yPos += totalesHeight + 15;

  // ==================== TOTAL EN LETRAS ====================
  doc.fontSize(15)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text(totalLetra + ' PESOS COLOMBIANOS', 40, yPos, { width: 530, align: 'right' });

  yPos += 30;

  // ==================== CUFE Y QR ====================
  const cufeHeight = 100;
  dibujarCaja(doc, 40, yPos, 530, cufeHeight, lightGray, borderColor, 6);

  doc.fontSize(14)
     .fillColor(primaryColor)
     .font('Helvetica-Bold')
     .text('CUFE:', 52, yPos + 12);

  doc.fontSize(13)
     .fillColor(textGray)
     .font('Helvetica')
     .text(cufe, 52, yPos + 32, { width: 390, lineBreak: true, lineGap: 2 });

  if (qrBuffer) {
    // QR con borde y fondo blanco
    doc.rect(482, yPos + 17, 68, 68).fillAndStroke('#ffffff', '#dddddd').lineWidth(1);
    doc.image(qrBuffer, 486, yPos + 21, { width: 60, height: 60 });
  }

  yPos += cufeHeight + 20;

  // ==================== FOOTER ====================
  // Línea superior del footer
  doc.moveTo(40, yPos)
     .lineTo(570, yPos)
     .lineWidth(1)
     .strokeColor(borderColor)
     .stroke();

  yPos += 15;

  doc.fontSize(10)
     .fillColor('#999')
     .font('Helvetica')
     .text('Software: ', 40, yPos, { continued: true, width: 530, align: 'center' });
  
  doc.font('Helvetica-Bold')
     .fillColor(primaryColor)
     .text('SysPyME', { continued: true });
  
  doc.font('Helvetica')
     .fillColor('#999')
     .text(' | Fabricante: SYSPYME.ORG');

  yPos += 18;

  doc.fontSize(9)
     .text('Haciendo función y cumplimiento de la resolución 000012 del 9 de febrero del 2021, nos permitimos generar esta factura electrónica. También, siguiendo el título V de la resolución 42 del 5 de mayo del 2020, hacemos cumplimiento de los requisitos mínimos para los documentos referentes a la facturación electrónica.', 
           40, yPos, { width: 530, align: 'center', lineGap: 2 });

  yPos += 30;

  doc.fontSize(10)
     .text(`© ${new Date().getFullYear()} Todos los derechos reservados.`, 40, yPos, { width: 530, align: 'center' });

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