import { getPool } from '../../config/secretManagment.js';

let pool;

export const createPool = async (company) => {
  pool = await getPool(company);
};

export const findUsuarioByCorreo = async (correo) => {
  return await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
};

export const findTempUsuarioByCorreo = async (correo) => {
  return await pool.query('SELECT * FROM temp_Usuarios WHERE correo = $1', [correo]);
};

export const findUsuarioByCorreoOHandle = async (identifier) => {
  return await pool.query(
    `SELECT * FROM usuarios WHERE correo = $1 OR handle = $1`,
    [identifier]
  );
};

export const createTempUsuario = async ({ nombre, correo, handle, password, code, created_at }) => {
  return await pool.query(
    'INSERT INTO temp_Usuarios (nombre, correo, handle, password, codigo_verificacion, created_at) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [nombre, correo, handle, password, code, created_at]
  );
};

export const deleteTempUsuario = async (correo) => {
  return await pool.query('DELETE FROM temp_Usuarios WHERE correo = $1', [correo]);
};

export const createUsuario = async ({ nombre, correo, handle, password }) => {
  return await pool.query(
    'INSERT INTO usuarios (nombre, correo, handle, password) VALUES ($1,$2,$3,$4) RETURNING *',
    [nombre, correo, handle, password]
  );
};

export const updateUsuarioCodigo = async (correo, code, fecha) => {
  return await pool.query(
    'UPDATE usuarios SET codigo_verificacion = $1, codigo_fecha = $2 WHERE correo = $3',
    [code, fecha, correo]
  );
};

export const updateTempUsuarioCodigo = async (correo, code, fecha) => {
  return await pool.query(
    'UPDATE temp_Usuarios SET codigo_verificacion = $1, codigo_fecha = $2 WHERE correo = $3',
    [code, fecha, correo]
  );
};
