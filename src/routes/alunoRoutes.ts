import { Router } from "express";
import { authenticate, requireAluno, requireFuncionario } from "../middleware/authMiddleware";
import { AlunoController } from "../controllers/alunoController";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Alunos
 *   description: Endpoints de Gestão de Alunos
 */

/**
 * @openapi
 * /aluno/register:
 *   post:
 *     summary: Cadastrar um novo aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - matricula
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: João da Silva
 *                 description: Nome completo, com pelo menos duas palavras e apenas letras.
 *               matricula:
 *                 type: string
 *                 pattern: '^\d{6}$'
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "012345"
 *               email:
 *                 type: string
 *                 format: email
 *                 pattern: '^[^\s@]+@alu\.ufc\.br$'
 *                 example: joao@alu.ufc.br
 *               senha:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 maxLength: 16
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_-]).{8,16}$'
 *                 example: Senha123!
 *                 description: Deve conter letra maiúscula, minúscula, número e caractere especial permitido.
 *     responses:
 *       201:
 *         description: Aluno cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Aluno registrado com sucesso." }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 1 }
 *                     authId: { type: integer, example: 10 }
 *                     nome: { type: string, example: "João da Silva" }
 *                     matricula: { type: string, example: "012345" }
 *                     email: { type: string, example: "joao@alu.ufc.br" }
 *                     permissao: { type: string, example: "ALUNO" }
 *                     token: { type: string, example: "eyJhbGciOiJI..." }
 *       400:
 *         description: Dados de cadastro inválidos
 *       409:
 *         description: E-mail ou matrícula já cadastrados
 *       500:
 *         description: Erro interno ao cadastrar aluno
 */
router.post("/register", AlunoController.register);

/**
 * @openapi
 * /aluno/meus-dados:
 *   get:
 *     summary: Obter dados do aluno logado
 *     tags: [Alunos]
 *     security:
 *       - OAuth2PasswordBearer: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do aluno retornados com sucesso
 *       401:
 *         description: Não autenticado (Token ausente ou inválido)
 *       403:
 *         description: Acesso negado (Requer permissão de ALUNO)
 *       404:
 *         description: Aluno não encontrado
 */
router.get("/meus-dados", authenticate, requireAluno, AlunoController.getMeusDados);

/**
 * @openapi
 * /aluno:
 *   get:
 *     summary: Listar todos os alunos (paginado)
 *     tags: [Alunos]
 *     security:
 *       - OAuth2PasswordBearer: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Quantidade de registros por página
 *     responses:
 *       200:
 *         description: Lista de alunos retornada com sucesso
 *       400:
 *         description: Formato de página ou limite inválido
 *       401:
 *         description: Não autenticado (Token ausente ou inválido)
 *       403:
 *         description: Acesso negado (Requer permissão de TECNICO, ASSISTENTE ou ADMIN)
 */
router.get("/", authenticate, requireFuncionario, AlunoController.getAllAlunos);

/**
 * @openapi
 * /aluno/email/{email}:
 *   get:
 *     summary: Buscar aluno por email (para funcionários)
 *     tags: [Alunos]
 *     security:
 *       - OAuth2PasswordBearer: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: { type: string }
 *         example: joao@aluno.com
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *       401:
 *         description: Não autenticado (Token ausente ou inválido)
 *       403:
 *         description: Acesso negado (Requer permissão de TECNICO, ASSISTENTE ou ADMIN)
 *       404:
 *         description: Aluno não encontrado
 */
router.get("/email/:email", authenticate, requireFuncionario, AlunoController.getAlunoByEmail);

/**
 * @openapi
 * /aluno/matricula/{matricula}:
 *   get:
 *     summary: Buscar aluno por matrícula (para funcionários)
 *     tags: [Alunos]
 *     security:
 *       - OAuth2PasswordBearer: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matricula
 *         required: true
 *         schema: { type: string }
 *         example: "2023001234"
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *       401:
 *         description: Não autenticado (Token ausente ou inválido)
 *       403:
 *         description: Acesso negado (Requer permissão de TECNICO, ASSISTENTE ou ADMIN)
 *       404:
 *         description: Aluno não encontrado
 */
router.get("/matricula/:matricula", authenticate, requireFuncionario, AlunoController.getAlunoByMatricula);

/**
 * @openapi
 * /aluno/{id}:
 *   get:
 *     summary: Buscar aluno por ID (para funcionários)
 *     tags: [Alunos]
 *     security:
 *       - OAuth2PasswordBearer: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: Aluno encontrado
 *       400:
 *         description: Id inválido
 *       401:
 *         description: Não autenticado (Token ausente ou inválido)
 *       403:
 *         description: Acesso negado (Requer permissão de TECNICO, ASSISTENTE ou ADMIN)
 *       404:
 *         description: Aluno não encontrado
 */
router.get("/:id", authenticate, requireFuncionario, AlunoController.getAlunoById);

export default router;