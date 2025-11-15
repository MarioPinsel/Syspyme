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

    const inventoryRow = invRes.rows[0];
    const productId = inventoryRow.id_producto;

    const productRes = await findProductByIdOrCode(pool, productId);
    const product = productRes.rows[0];

    const unchangedFields = [];
    const changedFields = {};

    if (quantity !== undefined) {
        if (quantity === inventoryRow.cantidad) {
            unchangedFields.push("quantity");
        } else {
            await updateInventoryQuantity(pool, id, quantity);
            changedFields.quantity = quantity;
        }
    }

    if (code !== undefined) {

        if (code === product.codigo) {
            unchangedFields.push("code");
        } else {
            const dupCode = await findProductByCodeExcept(pool, code, productId);
            if (dupCode.rowCount > 0) {
                return {
                    success: false,
                    message: "Ya existe un producto con ese código."
                };
            }
            changedFields.codigo = code;
        }
    }

    if (type !== undefined || description !== undefined) {

        const newType = type ?? product.tipo_producto;
        const newDesc = description ?? product.descripcion;

        const typeSame = newType === product.tipo_producto;
        const descSame = JSON.stringify(newDesc) === JSON.stringify(product.descripcion);

        if (typeSame && descSame) {
            unchangedFields.push("type");
            unchangedFields.push("description");
        } else {
            const dup = await findProductByType(pool, newType, newDesc);

            if (dup.rowCount > 0 && dup.rows[0].id !== productId) {
                return {
                    success: false,
                    message: "Ya existe un producto con ese tipo y descripción."
                };
            }

            changedFields.tipo_producto = newType;
            changedFields.descripcion = newDesc;
        }
    }

    if (unitPrice !== undefined) {
        if (unitPrice === product.precio_unitario) {
            unchangedFields.push("unitPrice");
        } else {
            changedFields.precio_unitario = unitPrice;
        }
    }

    let updatedProduct = product;

    if (Object.keys(changedFields).length > 0) {
        const res = await updateProductById(pool, productId, changedFields);
        updatedProduct = res.rows[0];
    }

    return {
        success: true,
        message: "Actualización completa.",
        changedFields,
        unchangedFields,
        updatedProduct
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
