import { Router } from "express";
import { authenticate, requireFuncionario } from "../middleware/authMiddleware";
import { AuxilioController } from "../controllers/auxilioController";

const router = Router();

/**
 * @openapi
 * /auxilio:
 *   get:
 *     summary: Listar todos os auxílios disponíveis
 *     tags: [Auxílio]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de auxílios retornada com sucesso
 */
router.get("/", authenticate, AuxilioController.listar);

/**
 * @openapi
 * /auxilio:
 *   post:
 *     summary: Criar um novo auxílio (somente funcionários/admin)
 *     tags: [Auxílio]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - tipoAuxilio
 *             properties:
 *               nome: { type: string, example: "Auxílio Moradia" }
 *               tipoAuxilio: { type: string, enum: [BOLSA, AUXILIO], example: "AUXILIO" }
 *               descricao: { type: string, example: "Auxílio financeiro para moradia" }
 *     responses:
 *       201:
 *         description: Auxílio criado com sucesso
 */
router.post("/", authenticate, requireFuncionario, AuxilioController.criar);

export default router;
