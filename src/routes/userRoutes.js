import userController from '../controllers/userController.js';
import { Router } from 'express';
import dotenv from 'dotenv';
import checkToken from '../middlewares/checkToken.js';
import upload from '../middlewares/upload.js';
import requireRole from '../middlewares/requireRole.js';
dotenv.config();

const router = Router();

router.post('/user/create', userController.create);
router.get('/user/get', checkToken, requireRole('admin'), userController.getAll);
router.get('/user/get/:userId', checkToken, requireRole('admin'), userController.getById);
router.put('/user/update', checkToken, upload, userController.update);
router.delete('/user/delete', checkToken, userController.delete);
router.get('/user/verifyemail/:token', userController.verifyEmail);
router.post('/user/login', userController.login);
router.post('/user/logout/:userId', userController.logout);
router.post('/user/changepassword', checkToken, userController.changePassword);

export default router;
