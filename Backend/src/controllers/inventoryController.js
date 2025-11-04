import { registerUser, confirmUser, loginUser } from '../services/userService.js';

export const createAccount = async (req, res) => {
    try {
        await registerUser(req.body);
        res.status(201).json({ message: 'Código enviado al correo. Verifica tu cuenta.' });
    } catch (error) {
        if (error.message === 'EMAIL_EXISTS') return res.status(409).json({ error: 'El correo ya está registrado.' });
        if (error.message === 'HANDLE_EXISTS') return res.status(409).json({ error: 'Nombre de usuario no disponible.' });
        if (error.message === 'PENDING_VERIFICATION') return res.status(409).json({ error: 'Registro pendiente de verificación.' });
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

export const verifyAccount = async (req, res) => {
    try {
        await confirmUser(req.body);
        res.status(200).json({ message: 'Cuenta verificada correctamente.' });
    } catch (error) {
        if (error.message === 'INVALID_CODE') return res.status(400).json({ error: 'Código inválido o expirado.' });
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

export const login = async (req, res) => {
    try {
        await loginUser(req.body);
        res.status(200).json({ message: 'Login exitoso.' });
    } catch (error) {
        if (error.message === 'EMAIL_NOT_FOUND') return res.status(401).json({ error: 'Correo no encontrado.' });
        if (error.message === 'INVALID_PASSWORD') return res.status(401).json({ error: 'Contraseña incorrecta.' });
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

