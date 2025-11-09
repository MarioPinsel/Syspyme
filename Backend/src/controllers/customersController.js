import { createCustomerService, getCustomersService, updateCustomerService } from '../services/customersService.js'

export const createCustomerController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await createCustomerService(pool, req.body);

        if (!result.success) {
            return res.status(409).json(result);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCustomersController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await getCustomersService(pool, req.body);

        if (!result.success) {
            return res.status(409).json(result);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCustomerController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await updateCustomerService(pool, req.body);

        if (!result.success) {
            return res.status(409).json(result);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};