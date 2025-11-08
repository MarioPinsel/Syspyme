import {
    addProductInInventory,
    createProduct,
    deleteFromInventory,
    findProductByIdOrCode,
    updateProductById,
    findProductByCode,
    findProductByType,
    findProductFromInventory,
    findAllProducts,
    updateInventoryQuantity,
    findInventoryById
} from "../repositories/inventory/inventoryRepository.js";

export const createProductService = async ({ type, description, unitPrice, quantity, code }) => {
    const exists = await findProductByCode(code);

    if (exists.rowCount > 0) {
        const existingProduct = exists.rows[0]
        return {
            success: false,
            message: `El código ${code} ya está asociado a otro producto.`,
            data: existingProduct
        };
    }

    const search = await findProductByType(type, description)
    if (search.rowCount > 0) {
        const existingProduct = search.rows[0]
        if (existingProduct.code !== code) {
            return {
                success: false,
                message: `Ya existe un producto con este tipo y descripción, pero con otro código.`,
                data: existingProduct
            };
        }
    }

    const result = await createProduct({ type, description, unitPrice, code });
    const productId = result.rows[0].id;

    await addProductInInventory({ product_id: productId, quantity });

    return {
        success: true,
        message: 'Producto creado correctamente',
        data: result.rows[0]
    };

}

export const addProductService = async ({ code, quantity }) => {
    const exists = await findProductByIdOrCode(code);
    if (exists.rowCount === 0) throw new Error('EMPTY');

    const productId = exists.rows[0].id;

    await addProductInInventory({ product_id: productId, quantity });

    return { message: 'Productos agregado correctamente' };
}

export const updateProductService = async ({
    id,               // id del inventario, siempre
    unitPrice,
    code,
    type,
    description,
    quantity
}) => {

    // 1. Buscar la fila del inventario
    const invResult = await findInventoryById(id);

    if (invResult.rowCount === 0) {
        return { success: false, message: "No existe un registro de inventario con ese ID." };
    }

    const inventoryRow = invResult.rows[0];
    const productId = inventoryRow.id_producto;

    // 2. Actualizar SOLO la cantidad de ese inventario
    if (quantity !== undefined) {
        const currentQty = inventoryRow.cantidad;

        if (currentQty === quantity) {
            return {
                success: false,
                message: "La cantidad es la misma, no se realizaron cambios.",
                inventory: inventoryRow
            };
        }

        await updateInventoryQuantity(id, quantity);
    }

    // 3. Si llegan campos del producto, actualizarlos
    const fields = {};

    if (unitPrice !== undefined) fields.precio_unitario = unitPrice;
    if (code !== undefined) fields.codigo = code;
    if (type !== undefined) fields.tipo_producto = type;
    if (description !== undefined) fields.descripcion = description;

    let updatedProduct = null;

    if (Object.keys(fields).length > 0) {
        const productResult = await updateProductById(productId, fields);
        updatedProduct = productResult.rows[0];
    }

    return {
        success: true,
        message: "Actualización realizada correctamente.",
        inventoryId: id,
        product: updatedProduct
    };
};

export const getProductsService = async () => {
    const result = await findAllProducts();

    if (result.rowCount === 0) {
        return {
            success: false,
            message: "No hay productos actualmente",
        };
    }

    return result.rows.map(row => ({
        inventoryId: row.inventory_id,
        cantidad: row.cantidad,
        createdAt: row.inventory_created_at,
        product: {
            id: row.product_id,
            codigo: row.product_code,
            tipo: row.tipo_producto,
            descripcion: row.descripcion,
            precioUnitario: row.precio_unitario
        }
    }));
};

export const deleteProductService = async ({ id }) => {

    const exists = await findProductByIdOrCode(id);
    if (exists.rowCount === 0) throw new Error('NOT_FOUND');
    const productId = exists.rows[0].id;
    const result = await findProductFromInventory(productId);
    if (result.rowCount === 0) throw new Error('NOT_FOUND_INVENTORY');

    await deleteFromInventory(productId);

    return { message: 'Producto eliminado correctamente (inventario vaciado).' };
};
