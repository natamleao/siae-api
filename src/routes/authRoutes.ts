import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { logout } from "../middleware/authMiddleware";

const router = Router();

router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", logout);

export default router;
