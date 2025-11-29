import { Router } from 'express';
import { loginDIANController, getCompaniesDIANController, registerCompanyController, getCompaniesPendingController, getCertificateByCompanyController, validateCertificateController } from '../controllers/dianController.js';
import { loginDIANValidation, actionValidation, getCertificateByCompanyValidation, validateCertificateValidation } from '../middleware/validators.js';
import { validate } from '../middleware/validation.js';
import { authToken, isDIAN } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', loginDIANValidation, validate, loginDIANController);
router.use(authToken, isDIAN);
router.get('/getCompanies', getCompaniesDIANController);
router.post('/registerCompany', actionValidation, validate, registerCompanyController);
router.get('/companiesPending', getCompaniesPendingController);
router.get('/getCertificate', getCertificateByCompanyValidation, getCertificateByCompanyController);
router.post('/validateCertificate', validateCertificateValidation, validateCertificateController);

export default router;