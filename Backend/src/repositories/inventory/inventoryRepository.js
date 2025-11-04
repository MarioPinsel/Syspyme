import { pool } from '../../config/db.js';

export const findProductByTypeAndCode = async (code, type, description = {}) => {
    return await pool.query(
        'SELECT * FROM productos WHERE codigo = $1 AND tipo_producto = $2 AND descripcion = $3::jsonb',
        [code, type, JSON.stringify(description)]
    );
};

export const findProductByType = async (type, description = {}) => {
    return await pool.query(
        'SELECT * FROM productos WHERE tipo_producto = $1 AND descripcion = $2::jsonb',
        [type, JSON.stringify(description)]
    );
};

export const findProductByCode = async (code) => {
    return await pool.query(
        'SELECT * FROM productos WHERE codigo = $1',
        [code]
    );
};

export const findProductFromInventory = async (code) => {
    return await pool.query(
        `SELECT * FROM inventario WHERE id_producto = $1 AND estado = '1'`,
        [code]
    );
};

export const findProductById = async (id) => {
    return await pool.query(
        'SELECT * FROM productos WHERE id = $1',
        [id]
    );
};

export const createProduct = async ({ type, description, unitPrice, quantity, code }) => {
    return await pool.query(
        'INSERT INTO productos (tipo_producto, descripcion, precio_unitario, cantidad, codigo) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [type, description, unitPrice, quantity, code]
    );
};

export const addProductQuantity = async ({ productId, quantity }) => {
    return await pool.query(
        'UPDATE productos SET cantidad = cantidad + $1 WHERE id = $2',
        [quantity, productId]
    );
};

export const addProductInInventory = async ({ product_id, state }) => {
    return await pool.query(
        'INSERT INTO inventario (id_producto, estado) VALUES ($1, $2)',
        [product_id, state]
    );
};

export const updateProductById = async (id, fields) => {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE productos SET ${setClause} WHERE id = $1 RETURNING *`;

    return await pool.query(query, [id, ...values]);
};

export const deleteFromInventory = async (productId, limit = null, all = false) => {
    if (all) {
        return await pool.query(
            `DELETE FROM inventario WHERE id_producto = $1 AND estado = '1'`,
            [productId]
        );
    }

    return await pool.query(
        `DELETE FROM inventario
         WHERE id IN (
             SELECT id FROM inventario
             WHERE id_producto = $1 AND estado = '1'
             ORDER BY fecha_ingreso ASC
             LIMIT $2
         )`,
        [productId, limit]
    );
};

export const updateQuantity = async (id, quantity) => {
    return await pool.query(
        'UPDATE productos SET cantidad = $1 WHERE id = $2',
        [quantity, id]
    );
};
