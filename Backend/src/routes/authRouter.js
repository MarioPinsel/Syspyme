import { Router } from 'express';
import {
    createCompany,
    createAccount,
    verifyAccountController,
    login,
    verifyLogin
} from '../controllers/authController.js';
import { registerValidationEmpresa, registerValidation, loginValidation } from '../middleware/validators.js';
import { validate } from '../middleware/validation.js';
import { authToken, isAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/registerEmpresa', registerValidationEmpresa, validate, createCompany);
router.post('/registerUser', authToken, isAdmin, registerValidation, validate, createAccount);
router.post('/verify', authToken, verifyAccountController);
router.post('/login', loginValidation, validate, login);
router.post('/verify-login', authToken, verifyLogin);

export default router;
