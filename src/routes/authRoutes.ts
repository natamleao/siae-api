import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();

router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

export default router;
