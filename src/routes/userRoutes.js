import userController from '../controllers/userController.js';
import { Router } from 'express';

const router = Router();

router.get('/user', userController.getAll);
router.get('/user/:userId', userController.getById)
router.post('/user/create', userController.create);

export default router;
