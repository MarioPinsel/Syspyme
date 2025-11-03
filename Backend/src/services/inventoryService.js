import {
    addProductInInventory,
    addProductQuantity,
    createProduct,
    deleteFromInventory,
    findProductByType,
    findProductById,
    updateProductById,
    updateQuantity
} from "../repositories/inventory/inventoryRepository.js";

export const addProductService = async ({ type, description, unitPrice, quantity, code }) => {
    const exists = await findProductByType(type, description);

    let productId;

    if (exists.rowCount > 0) {
        const existingCode = exists.rows[0];
        if (existingCode.codigo !== code) {
            throw new Error('CODE_ERROR');
        }
        if (existingCode.tipo_Producto !== type) {
            throw new Error('TYPE_ERROR');
        }

        productId = existingProduct.id;
        await addProductQuantity({ productId, quantity });
    } else {
        const result = await createProduct({ type, description, unitPrice, quantity, code });
        productId = result.rows[0].id;
    }

    for (let i = 0; i < quantity; i++) {
        await addProductInInventory({ product_id: productId, state: '1' });
    }

    return { message: 'Producto agregado correctamente', productId };
};

export const updateProductService = async ({ id, unitPrice, quantity, code }) => {
    const productResult = await findProductById(id);
    if (productResult.rowCount === 0) {
        return { message: "No se encontró un producto con ese ID." };
    }

    const currentProduct = productResult.rows[0];
    const currentQuantity = currentProduct.cantidad;

    const fields = {};

    if (unitPrice !== undefined) fields.precio_unitario = unitPrice;
    if (code !== undefined) fields.codigo = code;

    if (quantity !== undefined) {
        const diff = quantity - currentQuantity;

        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                await addProductInInventory({ product_id: id, state: '1' });
            }
        } else if (diff < 0) {
            await deleteFromInventory(id, Math.abs(diff));
        }

        fields.cantidad = quantity;
    }

    const result = await updateProductById(id, fields);

    return {
        message: "Producto actualizado correctamente.",
        product: result.rows[0]
    };
};

export const getProductService = async ({ id }) => {
    const result = await findProductById(id);
    if (result.rowCount === 0) throw new Error('Producto no encontrado');
    return result.rows[0];
};

export const deleteProductService = async ({ id }) => {
    const result = await findProductById(id);
    if (result.rowCount === 0) throw new Error('Producto no encontrado');

    await deleteFromInventory(id, null, true);
    await updateQuantity(id, 0);

    return { message: 'Producto eliminado correctamente (inventario vaciado).' };
};
