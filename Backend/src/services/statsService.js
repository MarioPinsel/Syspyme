import { getAllProducts } from '../repositories/inventory/inventoryRepository.js';
import { getAllReceipts, getReceiptByCompany  } from '../repositories/sale/salesRepository.js';

export const statsService = async (pool) => {
    const products = await getAllProducts(pool);
    const receipts = await getAllReceipts(pool);

    return {
        products: products.rows[0].total,
        invoices: receipts.rows[0].total
    };
};


export const statsSalesService = async (pool, companyId) => {
  try {
    const result = await getReceiptByCompany(pool, companyId);
    return result.rows;
  } catch (error) {
    console.error("Error obteniendo estadísticas de ventas:", error);
    throw error;
  }
};


