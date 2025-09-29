import { Router } from 'express';
import { createAccount } from './controllers.js';
import { registerValidation } from './middleware/registrer.js';
import { validate } from './middleware/validation.js';


const router = Router();
router.post('/auth/register', registerValidation, validate, createAccount);


export default router;