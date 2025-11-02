import {
    registerEmpresa,
    registerUsuario,
    verifyAccount,
    loginUsuario,
    verifyLoginUsuario
} from '../services/userService.js';

export const createCompany = async (req, res) => {
    try {
        const result = await registerEmpresa(req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'EMPRESA_ALREADY_EXISTS') return res.status(409).json({ error: 'La empresa ya existe.' });
        if (error.message === 'PENDING_VERIFICATION') return res.status(409).json({ error: 'Registro pendiente de verificación.' });
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

export const createAccount = async (req, res) => {
    try {
        const result = await registerUsuario(req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'USUARIO_ALREADY_EXISTS') return res.status(409).json({ error: 'El correo ya está registrado.' });
        if (error.message === 'PENDING_VERIFICATION') return res.status(409).json({ error: 'Registro pendiente de verificación.' });
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

export const verifyAccountController = async (req, res) => {
    try {
        const { codigo } = req.body;
        const { correo, tipo } = req.user;
        const result = await verifyAccount({ correo, tipo, codigo });
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'INVALID_CODE') return res.status(400).json({ error: 'Código inválido.' });
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

export const login = async (req, res) => {
    try {
        const { empresa, empresaPassword, usuario, password } = req.body;
        const result = await loginUsuario({ empresa, empresaPassword, usuario, password });
        res.status(200).json(result);
    } catch (error) {
        if (error.message.includes('COMPANY')) return res.status(400).json({ error: 'Datos de empresa incorrectos.' });
        if (error.message.includes('USER')) return res.status(400).json({ error: 'Datos de usuario incorrectos.' });
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

export const verifyLogin = async (req, res) => {
    try {
        const { codigo } = req.body;
        const { correo } = req.user;
        const result = await verifyLoginUsuario({ correo, codigo });
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'INVALID_CODE') return res.status(400).json({ error: 'Código inválido.' });
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};
