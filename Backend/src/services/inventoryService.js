import {
    findProductByType,
    findProductByCode,
    findProductByIdOrCode,
    findProductFromInventory,
    findAllProducts,
    findInventoryById,
    createProduct,
    addProductInInventory,
    updateInventoryQuantity,
    updateProductById,
    deleteFromInventory
} from "../repositories/inventory/inventoryRepository.js";


export const createProductService = async (pool, { type, description, unitPrice, quantity, code }) => {

    const exists = await findProductByCode(pool, code);

    if (exists.rowCount > 0) {
        return {
            success: false,
            message: `El código ${code} ya está asociado a otro producto.`,
            data: exists.rows[0]
        };
    }

    const search = await findProductByType(pool, type, description);
    if (search.rowCount > 0) {
        const existing = search.rows[0];
        if (existing.code !== code) {
            return {
                success: false,
                message: `Ya existe un producto con este tipo y descripción, pero con otro código.`,
                data: existing
            };
        }
    }

    const result = await createProduct(pool, { type, description, unitPrice, code });
    const productId = result.rows[0].id;

    await addProductInInventory(pool, { product_id: productId, quantity });

    return {
        success: true,
        message: "Producto creado correctamente",
        data: result.rows[0]
    };
};


export const addProductService = async (pool, { code, quantity }) => {
    const exists = await findProductByIdOrCode(pool, code);
    if (exists.rowCount === 0) throw new Error("EMPTY");

    const productId = exists.rows[0].id;

    await addProductInInventory(pool, { product_id: productId, quantity });

    return { message: "Producto agregado correctamente" };
};


export const updateProductService = async (pool, {
    id, unitPrice, code, type, description, quantity
}) => {

    const invRes = await findInventoryById(pool, id);

    if (invRes.rowCount === 0) {
        return { success: false, message: "No existe un registro de inventario con ese ID." };
    }

    const row = invRes.rows[0];
    const productId = row.id_producto;

    if (quantity !== undefined) {
        if (row.cantidad === quantity) {
            return {
                success: false,
                message: "La cantidad es la misma, no se realizaron cambios.",
                inventory: row
            };
        }
        await updateInventoryQuantity(pool, id, quantity);
    }

    const fields = {};
    if (unitPrice !== undefined) fields.precio_unitario = unitPrice;
    if (code !== undefined) fields.codigo = code;
    if (type !== undefined) fields.tipo_producto = type;
    if (description !== undefined) fields.descripcion = description;

    let updatedProduct = null;

    if (Object.keys(fields).length > 0) {
        const productRes = await updateProductById(pool, productId, fields);
        updatedProduct = productRes.rows[0];
    }

    return {
        success: true,
        message: "Actualización realizada correctamente.",
        inventoryId: id,
        product: updatedProduct
    };
};


export const getProductsService = async (pool) => {
    const result = await findAllProducts(pool);

    if (result.rowCount === 0) {
        return { success: false, message: "No hay productos actualmente" };
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


export const deleteProductService = async (pool, { id }) => {
    const exists = await findProductByIdOrCode(pool, id);
    if (exists.rowCount === 0) throw new Error("NOT_FOUND");

    const productId = exists.rows[0].id;

    const inv = await findProductFromInventory(pool, productId);
    if (inv.rowCount === 0) throw new Error("NOT_FOUND_INVENTORY");

    await deleteFromInventory(pool, productId);

    return { message: "Producto eliminado correctamente (inventario vaciado)." };
};
