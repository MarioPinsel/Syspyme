import { createReceipt, createDetailReceipt, addXMLAndCUFEToReceipt } from '../repositories/sale/salesRepository.js'
import { findCustomerByDocument } from '../repositories/customer/customersRepository.js'
import { findUsuarioByCorreo } from '../repositories/user/userRepository.js'
import { getTotalStockByProductId, findProductByCode, getInventoryByProductId, updateInventoryQuantity, deleteFromInventory } from '../repositories/inventory/inventoryRepository.js'
import { getFirmaDigital } from '../utils/firmaDigital.js'
import { generarCUFE } from '../utils/cufeUtils.js';
import { findEmpresaByNombre } from '../repositories/enterprise/companyRepository.js';
import { sendFacturaEmail } from '../utils/sendFacturaEmail.js';
import {generarXMLFactura} from '../utils/generatexml.js'

const iva = 0.19;

export const createSaleService = async (pool, correo, empresaNombre, {document, items, paymentMethod, paymentType, creditTerm}) => {

    const clienteRes = await findCustomerByDocument(pool, document);
    if (clienteRes.rowCount === 0) {
        return { success: false, message: "Cliente no encontrado." };
    }
    const cliente = clienteRes.rows[0];

    const userRes = await findUsuarioByCorreo(pool, correo);
    const usuario = userRes.rows[0];

    const empresaRes = await findEmpresaByNombre(empresaNombre);
    const empresa = empresaRes.rows[0];

    let subTotal = 0;
    const detalles = [];

    for (const item of items) {
        const prodRes = await findProductByCode(pool, item.code);
        if (prodRes.rowCount === 0) return { success: false, message: `Producto ${item.code} no encontrado.` };
        const producto = prodRes.rows[0];

        const stockRes = await getTotalStockByProductId(pool, producto.id);
        if (stockRes.rows[0].total_stock < item.quantity)
            return { success: false, message: `Stock insuficiente para producto ${item.code}` };

        let restante = item.quantity;
        const invRes = await getInventoryByProductId(pool, producto.id);
        for (const row of invRes.rows) {
            if (restante <= 0) break;
            if (row.cantidad <= restante) {
                await deleteFromInventory(pool, row.id);
                restante -= row.cantidad;
            } else {
                await updateInventoryQuantity(pool, row.id, row.cantidad - restante);
                restante = 0;
            }
        }

        const subtotal = producto.precio_unitario * item.quantity;
        subTotal += subtotal;
        const descripcionArray = Object.values(producto.descripcion).join(" ");
        detalles.push({
            producto_id: producto.id,
            producto_code: producto.codigo,
            tipo_producto: producto.tipo_producto,
            descripcion: `${producto.tipo_producto} ${descripcionArray}`,
            unidades: item.quantity,
            valor_unitario: producto.precio_unitario,
            total: subtotal
        });
    }


    const impuestos = subTotal * iva;
    const totalConIva = subTotal + impuestos;
    const plazoFinal = paymentType.toLowerCase() === "contado" ? 0 : creditTerm;
    const firma_digital = getFirmaDigital();

    const receipt = await createReceipt(pool, cliente.id, usuario.id, paymentMethod, paymentType, subTotal, impuestos, plazoFinal, totalConIva, 'aun_nocufe', firma_digital);
    const receiptId = receipt.rows[0].id;
    for (const d of detalles) {
        await createDetailReceipt(
            pool,
            receiptId,
            d.producto_id,
            d.tipo_producto,
            JSON.stringify(d.descripcion),
            d.unidades,
            d.valor_unitario,
            d.total
        );
    }

    const cufe = generarCUFE({
        numFac: `FV${receiptId}`,
        fecFac: new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" }),  
        horFac: new Date().toLocaleTimeString("en-GB", { timeZone: "America/Bogota", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }),
        valFac: subTotal.toFixed(2),
        codImp1: '01',
        valImp1: impuestos.toFixed(2),
        codImp2: '04',
        valImp2: '0.00',
        codImp3: '03',
        valImp3: '0.00',
        valTot: totalConIva.toFixed(2),
        nitFE: empresa.nit,
        numAdq: cliente.documento,
        clTec: "CLAVE-TECNICA-PRUEBAS",
        tipoAmbiente: '1'
    });

    const facturaXML = generarXMLFactura({
        receiptId,
        empresa,
        cliente,
        vendedor: usuario,
        detalles,
        subTotal,
        impuestos,
        totalConIva,
        cufe,
        firma_digital,
        paymentMethod,
        paymentType,
        plazoFinal
    })

    await addXMLAndCUFEToReceipt(pool, receiptId, cufe, facturaXML);
    await sendFacturaEmail(facturaXML, cliente.correo);

    return { success: true, message: "Venta creada exitosamente.", receiptId }

}
export const getSalesService = async () => {
}

export const deleteSaleService = async () => {
}