import Router from 'express';
import { statsController } from '../controllers/statsController.js'
import { authToken, isAdmin } from '../middleware/authMiddleware.js';


const router = Router();

router.use(authToken, isAdmin)

router.get('/stats', statsController)



export default router;