import { Router } from "express";
import postController from "../controllers/postController.js";

const router = Router()

router.get('/post/get', postController.getAll)
router.get('/post/get/:postId', postController.getById);

export default router