import pg, { Result } from 'pg';
import fs from 'fs/promises';

export const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

/*try {
  const schema = await fs.readFile('./models/schema.sql', 'utf8');
  await pool.query(schema);
  console.log('Esquema aplicado correctamente');
} catch (err) {
  console.error('Error al aplicar esquema:', err.message);
}*/
