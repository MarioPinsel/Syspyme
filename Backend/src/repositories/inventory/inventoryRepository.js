import { getPool } from '../../config/secretManagment.js';

let pool;

export const createPool = async (company) => {
    pool = await getPool(company);
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

export const findProductByIdOrCode = async (value) => {
    const isNumeric = /^\d+$/.test(value);

    if (isNumeric) {
        return await pool.query('SELECT * FROM productos WHERE id = $1', [Number(value)]);
    } else {
        return await pool.query('SELECT * FROM productos WHERE codigo = $1', [value]);
    }
};

export const findProductFromInventory = async (productId) => {
    return await pool.query(
        `SELECT * FROM inventario WHERE id_producto = $1`,
        [productId]
    );
};

export const findInventoryById = async (id) => {
    return await pool.query(
        `SELECT * FROM inventario WHERE id = $1`,
        [id]
    );
};

export const findProductById = async (id) => {
    return await pool.query(
        'SELECT * FROM productos WHERE id = $1',
        [id]
    );
};

export const findAllProducts = async () => {
    return await pool.query(`
    SELECT
      p.id AS product_id,
      p.codigo AS product_code,
      p.tipo_producto,
      p.descripcion,
      p.precio_unitario,
      i.id AS inventory_id,
      i.cantidad AS cantidad,
      i.fecha_ingreso AS inventory_created_at
    FROM productos p
    JOIN inventario i ON p.id = i.id_producto
  `);
};


export const createProduct = async ({ type, description, unitPrice, code }) => {
    return await pool.query(
        'INSERT INTO productos (tipo_producto, descripcion, precio_unitario, codigo) VALUES ($1, $2, $3, $4) RETURNING *',
        [type, description, unitPrice, code]
    );
};

export const addProductInInventory = async ({ product_id, quantity }) => {
    return await pool.query(
        'INSERT INTO inventario (id_producto, cantidad) VALUES ($1, $2)',
        [product_id, quantity]
    );
};

export const updateInventoryQuantity = async (id, quantity) => {
    return await pool.query(
        `UPDATE inventario SET cantidad = $1 WHERE id = $2`,
        [quantity, id]
    );
};

export const updateProductById = async (id, fields) => {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    const query = `UPDATE productos SET ${setClause} WHERE id = $1 RETURNING *`;

    return await pool.query(query, [id, ...values]);
};

export const deleteFromInventory = async (productId) => {
    return await pool.query(
        `DELETE FROM inventario WHERE id_producto = $1`,
        [productId]
    );
};

