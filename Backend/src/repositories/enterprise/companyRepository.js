import { pool } from '../../config/conectionCore.js';

export const createEmpresa = async (nombre, nit, correo, password, telefono, direccion, regimen) => {
  const query = `
    INSERT INTO empresas (nombre, nit, correo, password, telefono, direccion, regimen)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [nombre, nit, correo, password, telefono, direccion, regimen];
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

export const findEmpresasPendientes = async () => {
  const query = `SELECT nombre FROM empresas WHERE certificado = 'PENDIENTE'`;
  return await pool.query(query);
}

export const createTempEmpresa = async ({ nombre, nit, correo, password, telefono, direccion, regimen, nombre_admin, correo_admin, telefono_admin, code, created_at }) => {
  const query = `
    INSERT INTO temp_Empresas (nombre, nit, correo, password, telefono, direccion, regimen, nombre_admin, correo_admin, telefono_admin, codigo_verificacion, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
  `;
  const values = [nombre, nit, correo, password, telefono, direccion, regimen, nombre_admin, correo_admin, telefono_admin, code, created_at];
  return await pool.query(query, values);
};

export const findTempEmpresaByCorreo = async (correo) => {
  const query = `SELECT * FROM temp_Empresas WHERE correo = $1`;
  return await pool.query(query, [correo]);
};

export const findTempEmpresaByVerificacion = async () => {
  const query = `
    SELECT 
      nombre,
      nit,
      correo,
      telefono,
      direccion,
      regimen,
      nombre_admin,
      correo_admin,
      telefono_admin,
      created_at
    FROM temp_Empresas
    WHERE verified = true
  `;

  return await pool.query(query);
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

export const updateVerifiedTempEmpresa = async (correo) => {
  const query = `UPDATE temp_Empresas SET verified = true WHERE correo = $1`;
  return await pool.query(query, [correo]);
}

export const updateCertificadoEmpresa = async (empresaNombre, certificado) => {
  const query = `UPDATE empresas SET certificado = $1, certificado_fecha = NOW() WHERE nombre = $2`;
  return await pool.query(query, [certificado, empresaNombre]);
}
