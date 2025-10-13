import { Router } from 'express';
import { createAccount, login } from './controllers.js';
import { registerValidation, loginValidation } from './middleware/condition.js';
import { validate } from './middleware/validation.js';


const router = Router();
router.post('/auth/register', registerValidation, validate, createAccount);
router.post('/auth/login', loginValidation, validate, login);

export default router;