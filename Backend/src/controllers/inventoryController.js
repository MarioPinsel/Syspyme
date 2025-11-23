import {
    createProductService,
    addProductService,
    updateProductService,
    getProductsService,
    deleteProductService
} from "../services/inventoryService.js";

export const createProductController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await createProductService(pool, req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const addProductController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await addProductService(pool, req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const updateProductController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await updateProductService(pool, req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const getProductsController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await getProductsService(pool, req.query);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteProductController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await deleteProductService(pool, req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
