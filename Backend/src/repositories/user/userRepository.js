export const findUsuarioByCorreo = async (pool, correo) => {
  return await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
};

export const findTempUsuarioByCorreo = async (pool, correo) => {
  return await pool.query('SELECT * FROM temp_Usuarios WHERE correo = $1', [correo]);
};

export const findUsuarioByNombre = async (pool, correo) => {
  return await pool.query('SELECT * FROM usuarios WHERE nombre = $1', [correo]);
};

export const findTempUsuarioByNombre = async (pool, correo) => {
  return await pool.query('SELECT * FROM temp_Usuarios WHERE nombre = $1', [correo]);
};

export const findUsuarioByHandle = async (pool, correo) => {
  return await pool.query('SELECT * FROM usuarios WHERE handle = $1', [correo]);
};

export const findTempUsuarioByHandle = async (pool, correo) => {
  return await pool.query('SELECT * FROM temp_Usuarios WHERE handle = $1', [correo]);
};

export const findUsuarioByCorreoOHandle = async (pool, identifier) => {
  return await pool.query(
    `SELECT * FROM usuarios WHERE correo = $1 OR handle = $1`,
    [identifier]
  );
};

export const createTempUsuario = async (pool, { nombre, correo, handle, password, code, created_at }) => {
  return await pool.query(
    'INSERT INTO temp_Usuarios (nombre, correo, handle, password, codigo_verificacion, created_at) VALUES ($1,$2,$3,$4,$5,$6)',
    [nombre, correo, handle, password, code, created_at]
  );
};

export const deleteTempUsuario = async (pool, correo) => {
  return await pool.query('DELETE FROM temp_Usuarios WHERE correo = $1', [correo]);
};

export const createUsuario = async (pool, { nombre, correo, handle, telefono, password }) => {
  return await pool.query(
    'INSERT INTO usuarios (nombre, correo, handle, telefono, password) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [nombre, correo, handle, telefono, password]
  );
};

export const updateUsuarioCodigo = async (pool, correo, code, fecha) => {
  return await pool.query(
    'UPDATE usuarios SET codigo_verificacion = $1, codigo_fecha = $2 WHERE correo = $3',
    [code, fecha, correo]
  );
};

export const updateTempUsuarioCodigo = async (pool, correo, code, fecha) => {
  return await pool.query(
    'UPDATE temp_Usuarios SET codigo_verificacion = $1, codigo_fecha = $2 WHERE correo = $3',
    [code, fecha, correo]
  );
};
