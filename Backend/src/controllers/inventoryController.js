import { addProductService, updateProductService, getProductService, deleteProductService } from "../services/inventoryService.js"

export const addProductController = async (req, res) => {
    try {
        const result = await addProductService(req.body)
        res.status(201).json(result)
    } catch (error) {
        if (error.message === 'CODE_ERROR') return res.status(409).json({ error: 'El codigo del producto ya existe y es erróneo.' });
        if (error.message === 'TYPE_ERROR') return res.status(409).json({ error: 'El codigo del producto ya existe y es erróneo 2.' });
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export const updateProductController = async (req, res) => {
    try {
        const result = await updateProductService(req.body)
        res.status(200).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export const getProductController = async (req, res) => {
    try {
        const result = await getProductService(req.query)
        res.status(200).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const result = await deleteProductService(req.body)
        res.status(200).json(result)
    } catch (error) {
        if (error.message === 'NOT_FOUND_INVENTORY') return res.status(404).json({ error: 'No hay productos en el inventario pa eliminar.' });
        if (error.message === 'NOT_FOUND') return res.status(404).json({ error: 'No existe el producto.' });
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}