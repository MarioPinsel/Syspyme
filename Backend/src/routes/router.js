import { Router } from 'express';
import {
    createCompany,
    createAccount,
    verifyAccountController,
    login,
    verifyLogin
} from '../controllers/userController.js';
import { registerValidationEmpresa, registerValidation, loginValidation } from '../middleware/validators.js';
import { validate } from '../middleware/validation.js';
import { authToken, isAdmin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/auth/registerEmpresa', registerValidationEmpresa, validate, createCompany);
router.post('/auth/registerUser', authToken, isAdmin, registerValidation, validate, createAccount);
router.post('/auth/verify', authToken, verifyAccountController);
router.post('/auth/login', loginValidation, validate, login);
router.post('/auth/verify-login', authToken, verifyLogin);

export default router;
