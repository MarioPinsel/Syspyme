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
    margins: { top: 30, bottom: 30, left: 30, right: 30 }
  });
  
  // Capturar el PDF en buffers
  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));

  // Colores
  const darkBlue = '#003d5c';
  const lightGray = '#f5f5f5';
  const mediumGray = '#666666';
  const borderColor = '#cccccc';

  let yPos = 40;

  // Header con logo y título
  if (logoPath) {
    doc.image(logoPath, 30, yPos, { width: 120 });
  }
  
  doc.fontSize(18)
     .fillColor(darkBlue)
     .font('Helvetica-Bold')
     .text('Factura Electrónica de Venta', 200, yPos, { align: 'right' });
  
  doc.fontSize(10)
     .fillColor(mediumGray)
     .font('Helvetica')
     .text('Representación Impresa', 200, yPos + 22, { align: 'right' });

  yPos += 55;

  // Línea separadora superior
  doc.moveTo(30, yPos)
     .lineTo(580, yPos)
     .lineWidth(2)
     .strokeColor(darkBlue)
     .stroke();

  yPos += 15;

  // Información de factura en gris claro
  doc.rect(30, yPos, 550, 30)
     .fillAndStroke(lightGray, borderColor);
  
  doc.fontSize(9)
     .fillColor('#000000')
     .font('Helvetica')
     .text(`Factura N°: ${factura["cbc:ID"]}`, 40, yPos + 10)
     .text(`Fecha de emisión: ${fecha}  Hora de emisión: ${hora}`, 250, yPos + 10);

  yPos += 45;

  // Sección Emisor
  doc.fontSize(11)
     .fillColor('#ffffff')
     .font('Helvetica-Bold');
  
  doc.rect(30, yPos, 260, 25)
     .fillAndStroke(darkBlue, darkBlue);
  
  doc.text('Emisor', 40, yPos + 7);
  
  yPos += 25;
  
  // Contenido Emisor con borde
  const emisorHeight = 90;
  doc.rect(30, yPos, 260, emisorHeight)
     .strokeColor(borderColor)
     .stroke();
  
  yPos += 10;
  
  doc.fontSize(9)
     .fillColor('#000000')
     .font('Helvetica-Bold')
     .text('Razon Social/Nombre: ', 40, yPos, { continued: true })
     .font('Helvetica')
     .text(emisor["cbc:Name"], { width: 230 });
  
  yPos += 20;
  
  doc.font('Helvetica-Bold')
     .text('NIT: ', 40, yPos, { continued: true })
     .font('Helvetica')
     .text(emisor["cbc:CompanyID"]);
  
  yPos += 15;
  
  doc.font('Helvetica-Bold')
     .text('Vendedor: ', 40, yPos, { continued: true })
     .font('Helvetica')
     .text(vendedor["cbc:Name"]);
  
  yPos += 15;
  
  doc.font('Helvetica-Bold')
     .text('Contactenos: ', 40, yPos, { continued: true })
     .font('Helvetica')
     .text(vendedor["cbc:ElectronicMail"]);

  // Sección Cliente
  yPos -= 75;
  
  doc.rect(310, yPos, 270, 25)
     .fillAndStroke(darkBlue, darkBlue);
  
  doc.fontSize(11)
     .fillColor('#ffffff')
     .font('Helvetica-Bold')
     .text('Cliente', 320, yPos + 7);
  
  yPos += 25;
  
  // Contenido Cliente con borde
  doc.rect(310, yPos, 270, emisorHeight)
     .strokeColor(borderColor)
     .stroke();
  
  yPos += 10;
  
  doc.fontSize(9)
     .fillColor('#000000')
     .font('Helvetica-Bold')
     .text('Nombre: ', 320, yPos, { continued: true })
     .font('Helvetica')
     .text(cliente["cbc:Name"], { width: 240 });
  
  yPos += 20;
  
  doc.font('Helvetica-Bold')
     .text('Documento: ', 320, yPos, { continued: true })
     .font('Helvetica')
     .text(cliente["cbc:ID"]);
  
  yPos += 15;
  
  doc.font('Helvetica-Bold')
     .text('Correo: ', 320, yPos, { continued: true })
     .font('Helvetica')
     .text(cliente["cbc:Email"], { width: 240 });
  
  yPos += 15;
  
  doc.font('Helvetica-Bold')
     .text('Teléfono: ', 320, yPos, { continued: true })
     .font('Helvetica')
     .text(cliente["cbc:Phone"]);

  yPos += 90;

  // Tabla de productos - Header
  doc.rect(30, yPos, 550, 25)
     .fillAndStroke(darkBlue, darkBlue);
  
  doc.fontSize(11)
     .fillColor('#ffffff')
     .font('Helvetica-Bold')
     .text('Detalle de productos', 40, yPos + 7);
  
  yPos += 25;

  // Header de tabla con bordes
  doc.rect(30, yPos, 550, 30)
     .fillAndStroke(darkBlue, darkBlue);
  
  doc.fontSize(9)
     .fillColor('#ffffff')
     .font('Helvetica-Bold')
     .text('Código', 40, yPos + 10, { width: 70 })
     .text('Descripción', 115, yPos + 10, { width: 200 })
     .text('Cantidad', 320, yPos + 10, { width: 70, align: 'center' })
     .text('Valor Unitario', 395, yPos + 10, { width: 85, align: 'right' })
     .text('Total', 485, yPos + 10, { width: 85, align: 'right' });

  yPos += 30;

  // Filas de productos
  productos.forEach((p, index) => {
    const rowHeight = 25;
    
    // Borde de fila
    doc.rect(30, yPos, 550, rowHeight)
       .strokeColor(borderColor)
       .stroke();
    
    doc.fontSize(8)
       .fillColor('#000000')
       .font('Helvetica')
       .text(p["cbc:Code"] || '', 40, yPos + 8, { width: 70 })
       .text(p["cac:Item"]["cbc:Description"] || '', 115, yPos + 8, { width: 200 })
       .text(p["cbc:InvoicedQuantity"] || '', 320, yPos + 8, { width: 70, align: 'center' })
       .text(`$${formatearNumero(p["cac:Price"]["cbc:PriceAmount"]._)}`, 395, yPos + 8, { width: 85, align: 'right' })
       .text(`$${formatearNumero(p["cbc:LineExtensionAmount"]._)}`, 485, yPos + 8, { width: 85, align: 'right' });
    
    yPos += rowHeight;
  });

  yPos += 15;

  // Sección de totales y método de pago
  const totalesStartY = yPos;
  
  doc.fontSize(9)
     .fillColor('#000000')
     .font('Helvetica-Bold')
     .text('Método de Pago: ', 40, yPos, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:PaymentMethod"] || 'N/A');

  yPos += 15;

  doc.font('Helvetica-Bold')
     .text('Forma de Pago: ', 40, yPos, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:PaymentType"] || 'N/A');

  yPos += 15;

  doc.font('Helvetica-Bold')
     .text('Termino: ', 40, yPos, { continued: true })
     .font('Helvetica')
     .text(totales["cbc:FinalTerm"] || '0');

  // Totales a la derecha
  let totalesY = totalesStartY;
  
  doc.font('Helvetica-Bold')
     .text('Subtotal: ', 420, totalesY, { continued: true, width: 70 })
     .font('Helvetica')
     .text(`$${formatearNumero(totales["cbc:LineExtensionAmount"]._)}`, { width: 90, align: 'right' });

  totalesY += 15;

  doc.font('Helvetica-Bold')
     .text(`IVA (${tasaIVA}%): `, 420, totalesY, { continued: true, width: 70 })
     .font('Helvetica')
     .text(`$${formatearNumero(parseFloat(totales["cbc:PayableAmount"]._) - parseFloat(totales["cbc:TaxExclusiveAmount"]._))}`, { width: 90, align: 'right' });

  totalesY += 20;

  // Total con fondo oscuro
  doc.rect(420, totalesY - 5, 160, 25)
     .fillAndStroke(darkBlue, darkBlue);
  
  doc.fontSize(11)
     .fillColor('#ffffff')
     .font('Helvetica-Bold')
     .text('Total: ', 430, totalesY + 3, { continued: true })
     .text(`$${formatearNumero(totales["cbc:PayableAmount"]._)}`, { width: 130, align: 'right' });

  yPos = Math.max(yPos, totalesY + 25) + 15;

  // Total en letras centrado
  doc.fontSize(9)
     .fillColor('#000000')
     .font('Helvetica-Oblique')
     .text(totalLetra + ' PESOS COLOMBIANOS', 30, yPos, { width: 550, align: 'center' });

  yPos += 25;

  // CUFE y QR
  doc.rect(30, yPos, 550, 25)
     .fillAndStroke(darkBlue, darkBlue);
  
  doc.fontSize(11)
     .fillColor('#ffffff')
     .font('Helvetica-Bold')
     .text('CUFE:', 40, yPos + 7);

  yPos += 25;

  // Contenedor del CUFE con borde
  doc.rect(30, yPos, 550, 100)
     .strokeColor(borderColor)
     .stroke();

  doc.fontSize(7)
     .fillColor('#000000')
     .font('Helvetica')
     .text(cufe, 40, yPos + 10, { width: 370 });

  if (qrBuffer) {
    doc.image(qrBuffer, 450, yPos + 10, { width: 80 });
  }

  yPos += 110;

  // Footer con información legal
  doc.fontSize(7)
     .fillColor(mediumGray)
     .font('Helvetica')
     .text('Software: SysPyME | Fabricante: SYSPYME.ORG', 30, yPos, { width: 550, align: 'center' });

  yPos += 12;

  doc.fontSize(7)
     .text('Haciendo función y cumplimiento de la resolución 000012 del 9 de febrero del 2021, nos permitimos generar esta factura electrónica. También, siguiendo el título V de la', 
           30, yPos, { width: 550, align: 'center' });
  
  yPos += 10;
  
  doc.text('resolución 42 del 5 de mayo del 2020, hacemos cumplimiento de los requisitos mínimos para los documentos referentes a la declaración electrónica.', 
           30, yPos, { width: 550, align: 'center' });

  yPos += 15;

  doc.text(`© ${new Date().getFullYear()} Todos los derechos reservados.`, 30, yPos, { width: 550, align: 'center' });

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