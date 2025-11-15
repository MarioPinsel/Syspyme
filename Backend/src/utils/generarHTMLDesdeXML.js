import xml2js from "xml2js";

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

    // Asegurar que lineas sea siempre un array
    const productos = Array.isArray(lineas) ? lineas : [lineas];

    return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Factura Electrónica</title>
<style>
  body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
  h2 { text-align: center; margin-bottom: 30px; color: #0b3954; }
  .encabezado { border: 1px solid #ccc; padding: 10px 20px; margin-bottom: 15px; border-radius: 6px; }
  .info { margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  th { background-color: #f8f8f8; }
  .totales { text-align: right; margin-top: 25px; }
  .firma { margin-top: 30px; text-align: center; font-size: 12px; color: #777; }
  .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #999; }
</style>
</head>
<body>

  <h2>Factura Electrónica de Venta - Representación Impresa</h2>

  <div class="encabezado info">
    <strong>Factura N°:</strong> ${factura["cbc:ID"]}<br>
    <strong>Fecha de emisión:</strong> ${fecha}<br>
    <strong>CUFE:</strong> ${cufe}
  </div>

  <div class="encabezado info">
    <h3>Emisor</h3>
    <strong>Nombre:</strong> ${emisor["cbc:Name"]}<br>
    <strong>NIT:</strong> ${emisor["cbc:CompanyID"]}
  </div>

  <div class="encabezado info">
    <h3>Cliente</h3>
    <strong>Nombre:</strong> ${cliente["cbc:Name"]}<br>
    <strong>Documento:</strong> ${cliente["cbc:ID"]}
  </div>

  <h3>Detalle de productos</h3>
  <table>
    <tr>
      <th>ID Producto</th>
      <th>Descripción</th>
      <th>Cantidad</th>
      <th>Valor Unitario</th>
      <th>Total</th>
    </tr>
    ${productos.map(p => `
      <tr>
        <td>${p["cbc:ID"]}</td>
        <td>${p["cac:Item"]["cbc:Description"]}</td>
        <td>${p["cbc:InvoicedQuantity"]}</td>
        <td>${p["cac:Price"]["cbc:PriceAmount"]}</td>
        <td>${p["cbc:LineExtensionAmount"]}</td>
      </tr>
    `).join('')}
  </table>

  <div class="totales">
    <p><strong>Subtotal:</strong> ${totales["cbc:LineExtensionAmount"]}</p>
    <p><strong>IVA:</strong> ${(parseFloat(totales["cbc:PayableAmount"]) - parseFloat(totales["cbc:TaxExclusiveAmount"])).toFixed(2)}</p>
    <p><strong>Total:</strong> ${totales["cbc:PayableAmount"]}</p>
  </div>

  <div class="firma">
    <p>Firma digital: ${factura["ds:Signature"]}</p>
  </div>

  <div class="footer">
    <p>Software: <b>SysPyME</b> | Fabricante: SYSPYME.ORG</p>
    <p>&copy; ${new Date().getFullYear()} Todos los derechos reservados.</p>
  </div>

</body>
</html>
`;
}
