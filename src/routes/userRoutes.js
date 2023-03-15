import userController from '../controllers/userController.js';
import { Router } from 'express';

const router = Router();

router.get('/user', userController.getAll);
router.post('/user/create', userController.create);

export default router;
