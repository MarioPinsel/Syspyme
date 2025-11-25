import xml2js from "xml2js";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generarQRDesdeCUFE(cufe) {
  try {
    const qrBase64 = await QRCode.toDataURL(cufe, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 300
    });

    return qrBase64;
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

function obtenerLogoBase64() {
  try {
    const logoPath = path.join(__dirname, '../assets/logo-syspyme.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    return logoBase64;
  } catch (err) {
    console.error("Error cargando logo:", err);
    return '';
  }
}

export async function generarHTMLDesdeXML(xmlString) {
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
  const qr = await generarQRDesdeCUFE(cufe);
  const logo = obtenerLogoBase64();
  const vendedor = emisor["cac:AccountingContact"];
  const taxSubtotal = factura["cac:TaxTotal"]["cac:TaxSubtotal"];
  const tasaIVA = taxSubtotal["cac:TaxCategory"]["cbc:Percent"] || "19";

  const productos = Array.isArray(lineas) ? lineas : [lineas];

  return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Factura Electrónica</title>
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body { 
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    color: #333; 
    background: #f5f5f5;
    padding: 15px;
  }
  
  .contenedor {
    background: white;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border-radius: 8px;
    max-width: 900px;
    margin: 0 auto;
  }
  
  .header-logo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 3px solid #0b3954;
  }
  
  .logo-container img {
    max-height: 60px;
    max-width: 200px;
  }
  
  h2 { 
    color: #0b3954;
    font-size: 20px;
    text-align: right;
    margin: 0;
  }
  
  .encabezado { 
    border: 1px solid #e0e0e0; 
    padding: 12px 15px; 
    margin-bottom: 12px; 
    border-radius: 6px;
    background: #fafafa;
  }
  
  .encabezado h3 {
    margin: 0 0 8px 0;
    color: #0b3954;
    font-size: 14px;
    border-bottom: 2px solid #0b3954;
    padding-bottom: 4px;
  }
  
  .info { margin-bottom: 15px; }
  .info strong { color: #555; font-size: 13px; }
  .info span { font-size: 13px; }
  
  .grid-dos-columnas {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 15px;
  }
  
  .vendedor-info {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #e0e0e0;
  }
  
  .vendedor-info div {
    font-size: 13px;
    margin-bottom: 3px;
  }
  
  .vendedor-info strong {
    color: #0b3954;
    font-size: 13px;
  }
  
  .contacto-empresa {
    margin-top: 8px;
    font-size: 11px;
    color: #666;
  }
  
  .contacto-empresa strong {
    font-size: 11px;
  }
  
  h3 { 
    color: #0b3954; 
    margin-top: 15px;
    margin-bottom: 8px;
    font-size: 16px;
  }
  
  table { 
    width: 100%; 
    border-collapse: collapse; 
    margin-top: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    font-size: 12px;
  }
  
  th, td { 
    border: 1px solid #e0e0e0; 
    padding: 8px 6px; 
    text-align: left; 
  }
  
  th { 
    background-color: #0b3954; 
    color: white;
    font-weight: 600;
    font-size: 12px;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  td { font-size: 12px; }
  
  .text-right {
    text-align: right;
  }
  
  .totales { 
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 15px;
    padding: 12px;
    background: #fafafa;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
  }

  .totales-izquierda,
  .totales-derecha {
    flex: 1;
  }

  .totales-izquierda {
    text-align: left;
  }

  .totales-derecha {
    text-align: right;
  }

  .totales-izquierda p,
  .totales-derecha p { 
    margin: 5px 0; 
    font-size: 13px;
  }

  .totales-derecha p:last-child {
    font-size: 15px;
    color: #0b3954;
    border-top: 2px solid #0b3954;
    padding-top: 8px;
    margin-top: 8px;
    font-weight: bold;
  }

  .total-letras {
    font-size: 15px;
    color: #0b3954;
    font-weight: bold;
  }

  .firma { 
    margin-top: 15px; 
    padding: 10px;
    background: #f9f9f9;
    border-radius: 6px;
    font-size: 9px; 
    color: #666;
    word-wrap: break-word;
    border: 1px solid #e0e0e0;
  }
  
  .cufe-qr-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 15px;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
  }
  
  .cufe {
    flex: 1;
    padding-right: 15px;
    max-width: calc(100% - 100px);
  }
  
  .cufe strong {
    color: #0b3954;
    font-size: 14px;
    display: block; 
    margin-bottom: 5px;
  }
  
  .cufe-text {
    font-size: 13px;
    color: #666;
    word-break: break-all;
    margin-top: 4px;
    line-height: 1.4;
  }
  
  .qr-container {
    text-align: right;
    flex-shrink: 0;
  }
  
  .qr-container img {
    max-width: 80px;
    max-height: 80px;
    border: 1px solid #ddd;
    padding: 4px;
    background: white;
    border-radius: 4px;
  }
  
  .footer { 
    text-align: center; 
    margin-top: 20px; 
    padding-top: 15px;
    border-top: 1px solid #e0e0e0;
    font-size: 10px; 
    color: #999; 
  }
  
  .footer b {
    color: #0b3954;
  }
  
  @media print {
    body {
      padding: 0;
      background: white;
    }
    
    .contenedor {
      box-shadow: none;
      padding: 15px;
    }
  }
</style>
</head>
<body>

<div class="contenedor">
  <div class="header-logo">
    <div class="logo-container">
      <img src="${logo}" alt="Logo SysPyME">
    </div>
    <h2>Factura Electrónica de Venta<br><small style="font-size: 14px;">Representación Impresa</small></h2>
  </div>

  <div class="encabezado info">
    <strong>Factura N°:</strong> <span>${factura["cbc:ID"]}</span><br>
   <strong>Fecha de emisión:</strong> <span>${fecha}</span> <strong> Hora de emisión:</strong> <span>${hora}</span>
  </div>

  <div class="grid-dos-columnas">
    <div class="encabezado">
      <h3>Emisor</h3>
      <div><strong>Razon Social/Nombre:</strong> ${emisor["cbc:Name"]}</div>
      <div><strong>NIT:</strong> ${emisor["cbc:CompanyID"]}</div>

      <div class="vendedor-info">
        <div><strong>Vendedor:</strong> ${vendedor["cbc:Name"]}</div>
        <div><strong>Contactenos:</strong> ${vendedor["cbc:ElectronicMail"]}</div>          
      </div>                  
    </div>

    <div class="encabezado">
      <h3>Cliente</h3>
      <div><strong>Nombre:</strong> ${cliente["cbc:Name"]}</div>
      <div><strong>Documento:</strong> ${cliente["cbc:ID"]}</div>
      <div><strong>Correo:</strong> ${cliente["cbc:Email"]}</div>
      <div><strong>Telefono:</strong> ${cliente["cbc:Phone"]}</div>
    </div>
  </div>

  <h3>Detalle de productos</h3>
  <table>
    <tr>
      <th style="width: 10%;">Código</th>
      <th style="width: 40%;">Descripción</th>
      <th style="width: 10%;" class="text-right">Cantidad</th>
      <th style="width: 20%;" class="text-right">Valor Unitario</th>
      <th style="width: 20%;" class="text-right">Total</th>
    </tr>
    ${productos.map(p => `
      <tr>
          <td>${p["cbc:Code"]}</td>
          <td>${p["cac:Item"]["cbc:Description"]}</td>
          <td class="text-right">${p["cbc:InvoicedQuantity"]}</td>
          <td class="text-right">$${formatearNumero(p["cac:Price"]["cbc:PriceAmount"]._)}</td>
          <td class="text-right">$${formatearNumero(p["cbc:LineExtensionAmount"]._)}</td>
      </tr>
    `).join('')}
  </table>

  <div class="totales">
    <div class="totales-izquierda">
      <p><strong>Método de Pago:</strong> ${totales["cbc:PaymentMethod"]}</p>
      <p><strong>Forma de Pago:</strong> ${totales["cbc:PaymentType"]}</p>     
      <p><strong>Plazo:</strong> ${totales["cbc:FinalTerm"]}</p>
    </div>
  
    <div class="totales-derecha">
     <p><strong>Subtotal:</strong> $${formatearNumero(totales["cbc:LineExtensionAmount"]._)}</p>
     <p><strong>IVA (${tasaIVA}%):</strong> $${formatearNumero((parseFloat(totales["cbc:PayableAmount"]._) - parseFloat(totales["cbc:TaxExclusiveAmount"]._)))}</p>
     <p><strong>R.ICA ($11.04%):</strong> $0}</p>
     <p><strong>INC ($0%):</strong> $0}</p>
     <p><strong>Total:</strong> $${formatearNumero(totales["cbc:PayableAmount"]._)}</p>
    </div>    
  </div>  

  <div class="totales-derecha">         
    <div class="total-letras">
      ${totalLetra} PESOS COLOMBIANOS
    </div>
  </div>

  <div class="cufe-qr-container">      
    <div class="cufe">     
      <strong>CUFE:</strong>
      <div class="cufe-text">${cufe}</div>      
    </div>    
    <div class="qr-container">
      <img src="${qr}" alt="Código QR">
    </div>
  </div>

  <div class="footer">
    <p>Software: <b>SysPyME</b> | Fabricante: SYSPYME.ORG</p>
    <p>Haciendo función y cumplimiento de la resolución 000012 del 9 de febrero del 2021, nos permitimos generar esta factura electrónica. También, siguiendo el título V de la resolución 42 del 5 de mayo del 2020, hacemos cumplimiento de los requisitos mínimos para los documentos referentes a la facturación electrónica.</p>
    <p>&copy; ${new Date().getFullYear()} Todos los derechos reservados.</p>
  </div>
</div>

</body>
</html>
`;
}