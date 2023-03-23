import { Router } from "express";
import postController from "../controllers/postController.js";
import checkToken from "../middlewares/checkToken.js";

const router = Router()

router.get('/post/get', postController.getAll)
router.get('/post/get/:slug', postController.getBySlug);
router.post('/post/create', checkToken, postController.create)

export default router