import { createProductService, addProductService, updateProductService, getProductsService, deleteProductService } from "../services/inventoryService.js"

export const createProductController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await createProductService(pool, req.body);

        if (!result.success) {
            return res.status(409).json(result);
        }

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addProductController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await addProductService(pool, req.body)
        res.status(201).json(result)
    } catch (error) {
        if (error.message === 'EMPTY') return res.status(409).json({ error: 'No existe ese producto con ese id o con ese codigo' });
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export const updateProductController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await updateProductService(pool, req.body);

        if (result.success === false) {
            return res.status(409).json(result);
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};


export const getProductsController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await getProductsService(pool, req.query)
        if (result.success === false) {
            return res.status(409).json(result);
        }
        res.status(200).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const pool = req.pool;
        const result = await deleteProductService(pool, req.body)
        res.status(200).json(result)
    } catch (error) {
        if (error.message === 'NOT_FOUND_INVENTORY') return res.status(404).json({ error: 'No hay productos en el inventario pa eliminar.' });
        if (error.message === 'NOT_FOUND') return res.status(404).json({ error: 'No existe el producto.' });
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}