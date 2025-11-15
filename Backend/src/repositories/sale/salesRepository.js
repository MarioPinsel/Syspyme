export const createReceipt = (pool, clienteId, usuarioId, paymentMethod, paymentType, plazoFinal, subTotal, impuestos, totalConIva, cufe, firma_digital) => {
  return pool.query(
    "INSERT INTO facturas (cliente_id, usuario_id, forma_pago, medio_pago, plazo_credito,sub_total,impuestos, precio_total, cufe, firma_digital) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
    [clienteId, usuarioId, paymentMethod, paymentType, plazoFinal, subTotal, impuestos, totalConIva, cufe, firma_digital]
  );
}

export const createDetailReceipt = (pool, facturaId, productoId, tipo, descripcion, unidades, valor_unitario, total) => {
  return pool.query(
    `INSERT INTO detalles_factura 
     (factura_id, producto_id, tipo_producto, descripcion, unidades, valor_unitario, total)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [facturaId, productoId, tipo, descripcion, unidades, valor_unitario, total]
  );
};

export const addXMLAndCUFEToReceipt = (pool, receiptId, cufe, factura_xml) => {
  return pool.query(
    'UPDATE facturas SET cufe = $1, factura_xml = $2 WHERE id = $3',
    [cufe, factura_xml, receiptId]
  );
}












