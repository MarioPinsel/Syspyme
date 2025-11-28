import { pool } from '../../config/conectionCore.js';

export const findUserDIANByUsuario = async (usuario) => {
    const query = `SELECT * FROM usuariosdian WHERE usuario = $1`;
    return await pool.query(query, [usuario]);
}