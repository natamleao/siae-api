import { Router } from "express";
import { authenticate, requireAdmin, requireFuncionario } from "../middleware/authMiddleware";
import { FuncionarioController } from "../controllers/funcionarioController";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Funcionarios
 *   description: Endpoints de Gestão de Funcionários (Técnicos, Assistentes e Administradores)
 */

/**
 * @openapi
 * /funcionario/register:
 *   post:
 *     summary: Cadastrar um novo funcionário (Requer permissão de ADMIN)
 *     tags: [Funcionarios]
 *     security:
 *       - OAuth2PasswordBearer: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FuncionarioRegisterInput'
 *     responses:
 *       201:
 *         description: Funcionário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Todos os campos são obrigatórios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Não autenticado (Token ausente ou inválido)
 *       403:
 *         description: Acesso negado (Usuário não é ADMIN)
 */
router.post("/register", authenticate, requireAdmin, FuncionarioController.register);

/**
 * @openapi
 * /funcionario/perfil:
 *   get:
 *     summary: Obter dados do perfil do funcionário logado
 *     tags: [Funcionarios]
 *     security:
 *       - OAuth2PasswordBearer: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do funcionário retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: number, example: 1 }
 *                 nome: { type: string, example: "Maria Silva" }
 *                 siape: { type: string, example: "7654321" }
 *                 permissao: { type: string, example: "TECNICO" }
 *       401:
 *         description: Não autenticado (Token ausente ou inválido)
 *       403:
 *         description: Acesso negado (Requer permissão de TECNICO ou ASSISTENTE)
 */
router.get("/perfil", authenticate, requireFuncionario, FuncionarioController.getMeuPerfil);

export default router;