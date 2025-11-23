import { createSaleService, getSaleService } from '../services/salesService.js'

export const createSaleController = async (req, res) => {
    try {
        const pool = req.pool;
        const { correo, empresaNombre } = req.user;
        console.log(req.body);
        const result = await createSaleService(pool, correo, empresaNombre, req.body);

        if (!result.success) {
            return res.status(409).json(result);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSaleController = async (req, res) => {
    const { id } = req.params;

    const result = await getSaleService(req.pool, id);

    if (!result.success) {
        return res.status(404).json(result);
    }

    res.setHeader("Content-Type", "text/html");
    return res.send(result.html);
};


