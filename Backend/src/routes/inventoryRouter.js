import { Router } from 'express';
import { authToken, isAdmin } from '../middleware/authMiddleware.js';
import { createProductController, addProductController, updateProductController, getProductsController, deleteProductController } from '../controllers/inventoryController.js'
import { createProductValidation, addProductValidation, updateProductValidation, getProductValidation } from '../middleware/validators.js';
import { validate } from '../middleware/validation.js';

const router = Router();

router.use(authToken, isAdmin);

router.post('/createProduct', createProductValidation, validate, createProductController)
router.post('/addProduct', addProductValidation, validate, addProductController)
router.patch('/updateProduct', updateProductValidation, validate, updateProductController)
router.get('/getProducts', getProductsController)
router.delete('/deleteProducts', getProductValidation, validate, deleteProductController)

export default router;