import {
    registerEmpresa,
    registerUsuario,
    verifyAccount,
    loginUsuario,
    verifyLoginUsuario,
    getCertificateService,
    sendCertificateService
} from '../services/authService.js';

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
        const pool = req.pool;
        const { empresaNombre, userId } = req.user;
        const { nombre, correo, handle, password, telefono } = req.body;
        const result = await registerUsuario({ pool, userId, empresaNombre, nombre, correo, handle, password, telefono });
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
        const pool = req.pool;
        const { codigo } = req.body;
        const { empresaNombre, correo, tipo } = req.user;
        const result = await verifyAccount({ pool, empresaNombre, correo, tipo, codigo });
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'INVALID_CODE') return res.status(400).json({ error: 'Código invalido, revise el correo nuevamente' });
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

export const login = async (req, res) => {
    try {
        const { empresa, empresaPassword, usuario, password } = req.body;
        const result = await loginUsuario({ empresa, empresaPassword, usuario, password });
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);

        // Manejo de errores específicos
        switch (error.message) {
            case 'COMPANY_NOT_FOUND':
                return res.status(400).json({ error: 'La empresa no existe.' });
            case 'INVALID_COMPANY_CREDENTIALS':
                return res.status(400).json({ error: 'Contraseña de empresa incorrecta.' });
            case 'USER_NOT_FOUND':
                return res.status(400).json({ error: 'El usuario no existe.' });
            case 'INVALID_USER_CREDENTIALS':
                return res.status(400).json({ error: 'Contraseña de usuario incorrecta.' });
            default:
                return res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
};

export const verifyLogin = async (req, res) => {
    try {
        const pool = req.pool;
        const { codigo } = req.body;
        const { correo, empresaNombre } = req.user;
        const result = await verifyLoginUsuario({ pool, empresaNombre, correo, codigo });

        if (result.certificatePending) {
            return res.status(403).json({
                error: 'Su certificado digital se encuentra actualmente en revisión por parte de la DAIN. Recibirá una notificación por correo electrónico una vez sea aprobado. Este proceso puede tardar entre 24 a 48 horas hábiles.'
            });
        }

        if (result.requiresCertificate) {
            return res.status(428).json({
                token: result.token,
                error: "Debes completar la carga del certificado digital."
            });
        }

        if (result.noCertificate) {
            return res.status(403).json({
                error: "La empresa no tiene certificado digital. Contacte al administrador."
            });
        }

        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'INVALID_CODE') return res.status(400).json({ error: 'Código inválido.' });
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

export const getCertificateController = async (req, res) => {
    try {
        const pool = req.pool;
        const { correo, empresaNombre } = req.user;
        const result = await getCertificateService({ pool, empresaNombre, correo });

        res.setHeader("Content-Type", "text/html");

        return res.status(result.status).send(result.html);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const sendCertificateController = async (req, res) => {

    try {

        const { empresaNombre } = req.user;
        const result = await sendCertificateService(empresaNombre);

        return res.status(result.status).json({
            message: result.message
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
