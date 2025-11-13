import { createSaleService, getSalesService, deleteSaleService } from '../services/salesService.js'

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

export const getSalesController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await getSalesService(pool, req.body);

        if (!result.success) {
            return res.status(409).json(result);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteSaleController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await deleteSaleService(pool, req.body);

        if (!result.success) {
            return res.status(409).json(result);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};