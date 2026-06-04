import { Router } from "express";
import { authenticate, requireAdmin, requireFuncionario } from "../middleware/authMiddleware";
import { FuncionarioController } from "../controllers/funcionarioController";

const router = Router();

router.post("/register", authenticate, requireAdmin, FuncionarioController.register);
router.get("/perfil", authenticate, requireFuncionario, FuncionarioController.getMeuPerfil);

export default router;