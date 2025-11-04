import { Router } from 'express';
import { authToken, isAdmin } from '../middleware/authMiddleware.js';
import { addProductController, updateProductController, getProductController, deleteProductController } from '../controllers/inventoryController.js'
import { addProductValidation, updateProductValidation, getProductValidation } from '../middleware/validators.js';
import { validate } from '../middleware/validation.js';

const router = Router();

router.post('/addProduct', authToken, isAdmin, addProductValidation, validate, addProductController)
router.put('/updateProduct', authToken, isAdmin, updateProductValidation, updateProductController)
router.get('/getProduct', authToken, isAdmin, getProductValidation, getProductController)
router.delete('/deleteProduct', authToken, isAdmin, getProductValidation, deleteProductController)

export default router;