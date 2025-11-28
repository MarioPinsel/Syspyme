import { pool } from '../../config/conectionCore.js';

export const createEmpresa = async ({ nombre, nit, correo, password }) => {
  const query = `
    INSERT INTO empresas (nombre, nit, correo, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [nombre, nit, correo, password];
  return await pool.query(query, values);
};

export const findEmpresaByCorreo = async (correo) => {
  const query = `SELECT * FROM empresas WHERE correo = $1`;
  return await pool.query(query, [correo]);
};

export const findEmpresaByNombre = async (nombre) => {
  const query = `SELECT * FROM empresas WHERE nombre = $1`;
  return await pool.query(query, [nombre]);
};

export const createTempEmpresa = async ({ nombre, nit, correo, password, code, created_at }) => {
  const query = `
    INSERT INTO temp_Empresas (nombre, nit, correo, password, codigo_verificacion, created_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [nombre, nit, correo, password, code, created_at];
  return await pool.query(query, values);
};

export const findTempEmpresaByCorreo = async (correo) => {
  const query = `SELECT * FROM temp_Empresas WHERE correo = $1`;
  return await pool.query(query, [correo]);
};

export const findTempEmpresaByNombre = async (nombre) => {
  const query = `SELECT * FROM temp_Empresas WHERE nombre = $1`;
  return await pool.query(query, [nombre]);
};

export const deleteTempEmpresa = async (correo) => {
  const query = `DELETE FROM temp_Empresas WHERE correo = $1`;
  return await pool.query(query, [correo]);
};

export const updateTempEmpresaCodigo = async (correo, newCode, newCreatedAt) => {
  const query = `UPDATE temp_Empresas SET codigo_verificacion = $1, created_at = $2 WHERE correo = $3`;
  return await pool.query(query, [newCode, newCreatedAt, correo])
}

