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
    deleteFromInventory,
    findProductByCodeExcept
} from "../repositories/inventory/inventoryRepository.js";

export const createProductService = async (pool, { type, description, unitPrice, quantity, code }) => {

    const exists = await findProductByCode(pool, code);

    if (exists.rowCount > 0) {
        return {
            status: 409,
            message: `El código ${code} ya está asociado a otro producto.`,
            data: exists.rows[0]
        };
    }

    const search = await findProductByType(pool, type, description);
    if (search.rowCount > 0) {
        return {
            status: 409,
            message: `Ya existe un producto con este tipo y descripción, pero con otro código.`,
            data: search.rows[0]
        };
    }

    const result = await createProduct(pool, { type, description, unitPrice, code });
    const productId = result.rows[0].id;

    await addProductInInventory(pool, { product_id: productId, quantity });

    return {
        status: 201,
        message: "Producto creado correctamente",
        data: result.rows[0]
    };
};



export const addProductService = async (pool, { code, quantity }) => {

    const exists = await findProductByIdOrCode(pool, code);
    if (exists.rowCount === 0) {
        return { status: 404, message: "Producto no encontrado" };
    }

    const productId = exists.rows[0].id;
    await addProductInInventory(pool, { product_id: productId, quantity });

    return { status: 201, message: "Producto agregado correctamente" };
};

export const updateProductService = async (pool, {
    id, unitPrice, code, type, description, quantity
}) => {

    const invRes = await findInventoryById(pool, id);

    if (invRes.rowCount === 0) {
        return { status: 404, message: "No existe un registro de inventario con ese ID." };
    }

    const inventoryRow = invRes.rows[0];
    const productId = inventoryRow.id_producto;

    const productRes = await findProductByIdOrCode(pool, productId);
    const product = productRes.rows[0];

    const unchangedFields = [];
    const changedFields = {};

    if (quantity !== undefined && quantity !== inventoryRow.cantidad) {
        await updateInventoryQuantity(pool, id, quantity);
        changedFields.quantity = quantity;
    }

    if (code !== undefined && code !== product.codigo) {
        const dupCode = await findProductByCodeExcept(pool, code, productId);
        if (dupCode.rowCount > 0) {
            return { status: 409, message: "Ya existe un producto con ese código." };
        }
        changedFields.codigo = code;
    }

    if (type !== undefined || description !== undefined) {
        const newType = type ?? product.tipo_producto;
        const newDesc = description ?? product.descripcion;

        const dup = await findProductByType(pool, newType, newDesc);
        if (dup.rowCount > 0 && dup.rows[0].id !== productId) {
            return { status: 409, message: "Ya existe un producto con ese tipo y descripción." };
        }
        changedFields.tipo_producto = newType;
        changedFields.descripcion = newDesc;
    }

    if (unitPrice !== undefined && unitPrice !== product.precio_unitario) {
        changedFields.precio_unitario = unitPrice;
    }

    const updated = Object.keys(changedFields).length > 0
        ? (await updateProductById(pool, productId, changedFields)).rows[0]
        : product;

    return {
        status: 200,
        message: "Producto actualizado correctamente",
        updated
    };
};



export const getProductsService = async (pool) => {
    const result = await findAllProducts(pool);

    if (result.rowCount === 0) {
        return { status: 404, message: "No hay productos actualmente" };
    }

    return {
        status: 200,
        data: result.rows.map(row => ({
            inventoryId: row.inventory_id ?? null,
            cantidad: row.cantidad ?? 0,
            createdAt: row.inventory_created_at ?? null,
            product: {
                id: row.product_id,
                codigo: row.product_code,
                tipo: row.tipo_producto,
                descripcion: row.descripcion,
                precioUnitario: row.precio_unitario
            }
        }))
    };
};

export const deleteProductService = async (pool, { id }) => {

    const exists = await findProductByIdOrCode(pool, id);
    if (exists.rowCount === 0) {
        return { status: 404, message: "Producto no encontrado" };
    }

    const productId = exists.rows[0].id;

    const inv = await findProductFromInventory(pool, productId);
    if (inv.rowCount === 0) {
        return { status: 404, message: "El producto no tiene inventario registrado" };
    }

    await deleteFromInventory(pool, productId);

    return { status: 200, message: "Producto eliminado correctamente" };
};
