import { verifyToken } from '../utils/tokenUtils.js';

export const authToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Token no proporcionado.' });

        const decoded = verifyToken(token);

        req.user = decoded;
        next();
    } catch (err) {
        console.log("Verification error:", err);
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};


export const isAdmin = (req, res, next) => {
    const { tipo, isAdmin } = req.user || {};
    if (tipo === 'empresa' || isAdmin) return next();
    return res.status(403).json({ error: 'Solo una empresa o administrador puede realizar esta acción.' });
};

export const verified = (req, res, next) => {
    const { verified } = req.user || {};
    if (verified === true) return next();
    return res.status(403).json({ error: 'Registrate o inicia sesión' });
};
