import Router from 'express';
import { createSaleController, getSalesController, deleteSaleController } from '../controllers/salesController.js'
import { authToken } from '../middleware/authMiddleware.js';
import { createSaleValidation, deleteSaleValidation } from '../middleware/validators.js'
import { validate } from '../middleware/validation.js'

const router = Router();

router.use(authToken)

router.post('/createSale', createSaleValidation, validate, createSaleController)
router.get('/getSales', getSalesController)
router.delete('/deleteSale', deleteSaleValidation, validate, deleteSaleController)

export default router;