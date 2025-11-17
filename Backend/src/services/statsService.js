import { getAllProducts } from '../repositories/inventory/inventoryRepository.js';
import { getAllReceipts } from '../repositories/sale/salesRepository.js';

export const statsService = async (pool) => {
    const products = await getAllProducts(pool);
    const receipts = await getAllReceipts(pool);

    return {
        products: products.rows[0].total,
        invoices: receipts.rows[0].total
    };
};


