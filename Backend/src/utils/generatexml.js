import { create } from 'xmlbuilder2';
import writtenNumber from 'written-number';

writtenNumber.defaults.lang = 'es';
export function generarXMLFactura({
    receiptId,
    empresa,
    cliente,
    vendedor,
    detalles,
    subTotal,
    impuestos,
    totalConIva,
    cufe,
    firma_digital,
    paymentMethod,
    paymentType,
    plazoFinal
}) {
    console.log(vendedor)
    const fecha = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" });
    const hora = new Date().toLocaleTimeString("en-GB", { timeZone: "America/Bogota", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

    const xml = create({ version: '1.0', encoding: 'UTF-8' })
        .ele('Invoice', {
            xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
            'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
            'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
            'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#'
        })
        .ele('cbc:ID').txt(`FV${receiptId}`).up()
        .ele('cbc:IssueDate').txt(fecha).up()
        .ele('cbc:IssueTime').txt(hora).up()
        .ele('cbc:UUID').txt(cufe).up()
        .ele('cbc:StringNumber').txt(writtenNumber(Number(totalConIva), { lang: 'es' })).up()

        // Empresa (proveedor)
        .ele('cac:AccountingSupplierParty')
        .ele('cbc:CompanyID').txt(empresa.nit).up()
        .ele('cbc:Name').txt(empresa.nombre).up()
        // Información de contacto o vendedor
        .ele('cac:AccountingContact')
        .ele('cbc:Name').txt(vendedor.nombre).up()
        .ele('cbc:ElectronicMail').txt(empresa.correo).up()
        .up()
        .up()

        // Cliente (adquiriente)
        .ele('cac:AccountingCustomerParty')
        .ele('cbc:ID').txt(cliente.documento).up()
        .ele('cbc:Name').txt(cliente.nombre).up()
        .ele('cbc:Email').txt(cliente.correo).up()
        .ele('cbc:Phone').txt(cliente.telefono).up()
        .up()

        // Impuestos
        .ele('cac:TaxTotal')
        .ele('cbc:TaxAmount', { currencyID: 'COP' }).txt(Number(impuestos).toFixed(2)).up()
        .ele('cac:TaxSubtotal')
        .ele('cbc:TaxableAmount', { currencyID: 'COP' }).txt(Number(subTotal).toFixed(2)).up()
        .ele('cbc:TaxAmount', { currencyID: 'COP' }).txt(Number(impuestos).toFixed(2)).up()
        .ele('cac:TaxCategory')
        .ele('cac:TaxScheme')
        .ele('cbc:ID').txt('01').up()
        .ele('cbc:Name').txt('IVA').up()
        .up()
        .up()
        .up()
        .up()

        // Totales
        .ele('cac:LegalMonetaryTotal')
        .ele('cbc:LineExtensionAmount', { currencyID: 'COP' }).txt(Number(subTotal).toFixed(2)).up()
        .ele('cbc:TaxExclusiveAmount', { currencyID: 'COP' }).txt(Number(subTotal).toFixed(2)).up()
        .ele('cbc:TaxInclusiveAmount', { currencyID: 'COP' }).txt(Number(totalConIva).toFixed(2)).up()
        .ele('cbc:PayableAmount', { currencyID: 'COP' }).txt(Number(totalConIva).toFixed(2)).up()
        .ele('cbc:PaymentMethod').txt(paymentMethod).up()
        .ele('cbc:PaymentType').txt(paymentType).up()
        .ele('cbc:FinalTerm').txt(plazoFinal).up()
        .up();
    // 🔸 Detalles (líneas de productos)
    for (const d of detalles) {
        xml.ele('cac:InvoiceLine')
            .ele('cbc:Code').txt(d.producto_code).up()
            .ele('cbc:InvoicedQuantity').txt(d.unidades).up()
            .ele('cbc:LineExtensionAmount', { currencyID: 'COP' }).txt(d.total.toFixed(2)).up()
            .ele('cac:Item')
            .ele('cbc:Description').txt(d.descripcion).up()
            .ele('cbc:Name').txt(d.tipo_producto).up()
            .ele('cac:SellersItemIdentification')
            .ele('cbc:ID').txt(d.codigo).up() 
            .up()
            .up()
            .ele('cac:Price')
            .ele('cbc:PriceAmount', { currencyID: 'COP' }).txt(d.valor_unitario).up()
            .up()
            .up();
    }

    // 🔐 Firma digital
    xml.ele('ds:Signature')
        .ele('ds:SignatureValue').txt(firma_digital).up()
        .up();

    return xml.end({ prettyPrint: true });
}
