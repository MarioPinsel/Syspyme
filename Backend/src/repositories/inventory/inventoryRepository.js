export const findProductByType = (pool, type, description = {}) => {
    return pool.query(
        "SELECT * FROM productos WHERE tipo_producto = $1 AND descripcion = $2::jsonb",
        [type, JSON.stringify(description)]
    );
};

export const findProductByCode = (pool, code) => {
    return pool.query(
        "SELECT * FROM productos WHERE codigo = $1",
        [code]
    );
};
export const findProductByCodeExcept = (pool, code, idToExclude) => {
    return pool.query(
        "SELECT * FROM productos WHERE codigo = $1 AND id <> $2",
        [code, idToExclude]
    );
};

export const findProductByIdOrCode = (pool, value) => {
    const isNumeric = /^\d+$/.test(value);

    if (isNumeric) {
        return pool.query("SELECT * FROM productos WHERE id = $1", [Number(value)]);
    }

    return pool.query("SELECT * FROM productos WHERE codigo = $1", [value]);
};

export const findProductFromInventory = (pool, productId) => {
    return pool.query(
        "SELECT * FROM inventario WHERE id_producto = $1",
        [productId]
    );
};

export const findInventoryById = (pool, id) => {
    return pool.query(
        "SELECT * FROM inventario WHERE id = $1",
        [id]
    );
};

export const findAllProducts = (pool) => {
    return pool.query(`
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
        LEFT JOIN inventario i ON p.id = i.id_producto
    `);
};

export const createProduct = (pool, { type, description, unitPrice, code }) => {
    return pool.query(
        "INSERT INTO productos (tipo_producto, descripcion, precio_unitario, codigo) VALUES ($1, $2, $3, $4) RETURNING *",
        [type, description, unitPrice, code]
    );
};

export const addProductInInventory = (pool, { product_id, quantity }) => {
    return pool.query(
        "INSERT INTO inventario (id_producto, cantidad) VALUES ($1, $2)",
        [product_id, quantity]
    );
};

export const updateInventoryQuantity = (pool, id, quantity) => {
    return pool.query(
        "UPDATE inventario SET cantidad = $1 WHERE id = $2",
        [quantity, id]
    );
};

export const updateProductById = (pool, id, fields) => {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const query = `UPDATE productos SET ${setClause} WHERE id = $1 RETURNING *`;

    return pool.query(query, [id, ...values]);
};

export const deleteFromInventory = (pool, productId) => {
    return pool.query(
        "DELETE FROM inventario WHERE id_producto = $1",
        [productId]
    );
};

export const getTotalStockByProductId = (pool, productId) => {
    return pool.query(
        `SELECT COALESCE(SUM(cantidad), 0) AS total_stock
         FROM inventario
         WHERE id_producto = $1`,
        [productId]
    );
};

export const getInventoryByProductId = (pool, productId) => {
    return pool.query(
        `SELECT id, cantidad
         FROM inventario
         WHERE id_producto = $1
         ORDER BY fecha_ingreso ASC`,
        [productId]
    );
}

export const getAllProducts = (pool) => {
    return pool.query(`SELECT COUNT(*) AS total FROM productos`);
}