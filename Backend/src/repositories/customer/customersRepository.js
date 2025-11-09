export const findCustomerByDocument = (pool, document) => {
    return pool.query(
        "SELECT * FROM clientes WHERE documento = $1",
        [document]
    );
};

export const findCustomerById = (pool, id) => {
    return pool.query(
        "SELECT * FROM clientes WHERE id = $1",
        [id]
    );
};

export const findAllCustomers = (pool) => {
    return pool.query(`
        SELECT
            id,
            nombre,
            documento,
            telefono,
            correo
        FROM clientes
        ORDER BY id ASC
    `);
};

export const createCustomer = (pool, { name, document, phone, email }) => {
    return pool.query(
        "INSERT INTO clientes (nombre, documento, telefono, correo) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, document, phone, email]
    );
};

export const updateCustomer = (pool, id, fields) => {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const query = `UPDATE clientes SET ${setClause} WHERE id = $1 RETURNING *`;

    return pool.query(query, [id, ...values]);
};
