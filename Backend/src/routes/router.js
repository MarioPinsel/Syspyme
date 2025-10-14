import { Router } from 'express';
import { createAccount, login, verifyAccount } from '../controllers/userController.js';
import { registerValidation, loginValidation } from '../middleware/userValidators.js';
import { validate } from '../middleware/validation.js';

const router = Router();

router.post('/auth/register', registerValidation, validate, createAccount);
router.post('/auth/verify', verifyAccount);
router.post('/auth/login', loginValidation, validate, login);

export default router;
