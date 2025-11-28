import { Router } from 'express';
import { loginDIANController, getCompaniesDIANController, registerCompanyController } from '../controllers/dianController.js';
import { loginDIANValidation, actionValidation } from '../middleware/validators.js';
import { validate } from '../middleware/validation.js';
import { authToken, isDIAN } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', loginDIANValidation, validate, loginDIANController);
router.use(authToken, isDIAN);
router.get('/getCompanies', getCompaniesDIANController);
router.post('/registerCompany', actionValidation, validate, registerCompanyController);

export default router;