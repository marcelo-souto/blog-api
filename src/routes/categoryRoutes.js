import categoryController from "../controllers/categoryController.js";
import { Router } from "express";

const router = Router();

router.get("/category/get", categoryController.getAll);
router.get("/category/get/:categoryId", categoryController.getById);
router.post("/category/create", categoryController.create);
router.put("/category/update", categoryController.update);
router.delete("/category/delete", categoryController.delete);

export default router;
