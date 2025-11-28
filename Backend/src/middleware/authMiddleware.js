import { verifyToken } from '../utils/tokenUtils.js';
import { getPool } from '../config/secretManagment.js';

export const authToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Token no proporcionado.' });

        const decoded = verifyToken(token);

        req.user = decoded;
        if (decoded.created === true) {
            req.pool = await getPool(decoded.empresaNombre);

        }
        next();
    } catch (err) {
        console.log("Verification error:", err);
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};


export const isAdmin = (req, res, next) => {
    const { isAdmin } = req.user || {};
    if (isAdmin) return next();
    return res.status(403).json({ error: 'Solo una empresa o administrador puede realizar esta acción.' });
};

export const isDIAN = (req, res, next) => {
    const { isDIAN } = req.user || {};
    if (isDIAN) return next();
    return res.status(403).json({ error: 'Solo la DIAN puede hacer esta acción.' });
};

