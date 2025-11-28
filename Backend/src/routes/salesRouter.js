import Router from 'express';
import { createSaleController, getSaleController } from '../controllers/salesController.js'
import { authToken } from '../middleware/authMiddleware.js';
import { createSaleValidation } from '../middleware/validators.js'
import { validate } from '../middleware/validation.js'

const router = Router();

router.use(authToken)

router.post('/createSale', createSaleValidation, validate, createSaleController)
router.get('/getSale/:id', getSaleController)

export default router;