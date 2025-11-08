import { Router } from 'express';
import { authToken, isAdmin } from '../middleware/authMiddleware.js';
import { createProductController, addProductController, updateProductController, getProductsController, deleteProductController } from '../controllers/inventoryController.js'
import { createProductValidation, addProductValidation, updateProductValidation, getProductValidation } from '../middleware/validators.js';
import { validate } from '../middleware/validation.js';

const router = Router();

router.post('/createProduct', authToken, isAdmin, createProductValidation, validate, createProductController)
router.post('/addProduct', authToken, isAdmin, addProductValidation, validate, addProductController)
router.patch('/updateProduct', authToken, isAdmin, updateProductValidation, updateProductController)
router.get('/getProducts', authToken, isAdmin, getProductsController)
router.delete('/deleteProducts', authToken, isAdmin, getProductValidation, deleteProductController)

export default router;