import { Router } from "express";
import tokenController from "../controllers/tokenController.js";

const router = Router();

router.post("/token/validate", tokenController.validate);

export default router;