import { pool } from '../config/db.js';

export const findUserByEmail = async (email) => {
    return await pool.query('SELECT id, password FROM users WHERE email = $1', [email]);
};

export const findUserByHandle = async (handle) => {
    return await pool.query('SELECT id FROM users WHERE handle = $1', [handle]);
};

export const createUser = async (email, hashed, handle, name) => {
    return await pool.query(
        `INSERT INTO users (email, password, handle, name) VALUES ($1, $2, $3, $4)`,
        [email, hashed, handle, name]
    );
};
