import { pool } from '../config/db.js';

export const findTempUserByEmail = async (email) => {
    return await pool.query('SELECT * FROM temp_users WHERE email = $1', [email]);
};

export const createTempUser = async (email, hashed, handle, name, code) => {
    return await pool.query(
        `INSERT INTO temp_users (email, password, handle, name, verification_code)
     VALUES ($1, $2, $3, $4, $5)`,
        [email, hashed, handle, name, code]
    );
};

export const deleteTempUser = async (email) => {
    return await pool.query('DELETE FROM temp_users WHERE email = $1', [email]);
};

export const verifyTempUser = async (email, code) => {
    return await pool.query(
        'SELECT * FROM temp_users WHERE email = $1 AND verification_code = $2',
        [email, code]
    );
};
