import { pool } from '../config/db/pool.js'
import slug from 'slug'
import { hashPassword, checkPassword } from './utils/auth.js';

export const createAccount = async (req, res) => {
    const { email, password, handle, name } = req.body;

    try {
        const emailResult = await pool.query('SELECT id FROM users WHERE email = $1', [email])
        if (emailResult.rowCount > 0) {
            return res.status(409).json({ error: 'El usuario con ese mail ya existe' });
        }

        const safeHandle = slug(handle || '', '');
        const handleResult = await pool.query('SELECT id FROM users WHERE handle = $1', [safeHandle]);
        if (handleResult.rowCount > 0) {
            return res.status(409).json({ error: 'Nombre de usuario no disponible' });
        }

        const hashed = await hashPassword(password);

        await pool.query(
            `INSERT INTO users (email, password, handle, name) VALUES ($1, $2, $3, $4)`,
            [email, hashed, safeHandle, name]
        );

        res.status(201).send('Ha sido registrado correctamente');

    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor' });

    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userResult = await pool.query(
            'SELECT id, password FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rowCount === 0) {
            return res.status(401).json({ error: 'No existe ese correo' });
        }

        const user = userResult.rows[0];

        const validPassword = await checkPassword(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña inválida' });
        }

        res.status(200).json({ message: 'Login exitoso' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
