import { Router } from 'express'
import { createCustomerController, getCustomersController, updateCustomerController } from '../controllers/customersController.js'
import { authToken } from '../middleware/authMiddleware'
import { createCustomerValidation, updateCustomerValidation } from '../middleware/validators.js'
import { validate } from '../middleware/validation.js'

const router = Router()

router.use(authToken)

router.post('createCustomer', createCustomerValidation, validate, createCustomerController)
router.get('getCustomers', getCustomersController)
router.patch('updateCustomer', updateCustomerValidation, validate, updateCustomerController)

export default router;