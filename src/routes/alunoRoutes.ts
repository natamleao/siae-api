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
 *                 example: João da Silva
 *               matricula:
 *                 type: string
 *                 example: "2023001234"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@aluno.com
 *               senha:
 *                 type: string
 *                 format: password
 *                 example: senha123
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
 *                     id: { type: number, example: 1 }
 *                     nome: { type: string, example: "João da Silva" }
 *                     matricula: { type: string, example: "2023001234" }
 *                     email: { type: string, example: "joao@aluno.com" }
 *                     permissao: { type: string, example: "ALUNO" }
 *                     token: { type: string, example: "eyJhbGciOiJI..." }
 *       400:
 *         description: Dados inválidos, ou email/matrícula já cadastrados
 */
router.post("/register", AlunoController.register);

/**
 * @openapi
 * /aluno/dados-complementares:
 *   patch:
 *     summary: Atualizar dados complementares do aluno logado
 *     tags: [Alunos]
 *     security:
 *       - OAuth2PasswordBearer: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Todos os campos são opcionais — envie apenas os que deseja atualizar
 *             properties:
 *               cpf: { type: string, example: "123.456.789-00" }
 *               rg: { type: string, example: "MG-12.345.678" }
 *               emailContato: { type: string, example: "contato@email.com" }
 *               telefone: { type: string, example: "(11) 91234-5678" }
 *               curso: { type: string, example: "Engenharia de Software" }
 *               turno: { type: string, example: "Noturno" }
 *               anoIngresso: { type: number, example: 2023 }
 *               semestreAtual: { type: number, example: 3 }
 *               tipoIngresso: { type: string, example: "Vestibular" }
 *               dataNasc: { type: string, format: date, example: "2000-05-10" }
 *               sexo: { type: string, example: "Masculino" }
 *               orientacaoSexual: { type: string, example: "Heterossexual" }
 *               identidadeGenero: { type: string, example: "Cisgênero" }
 *               etniaRaca: { type: string, example: "Parda" }
 *               estadoCivil: { type: string, example: "Solteiro" }
 *               deficiencia: { type: string, example: "Nenhuma" }
 *     responses:
 *       200:
 *         description: Dados atualizados com sucesso
 *       400:
 *         description: CPF ou RG já cadastrados por outro aluno
 *       401:
 *         description: Não autenticado (Token ausente ou inválido)
 *       403:
 *         description: Acesso negado (Requer permissão de ALUNO)
 */
router.patch("/dados-complementares", authenticate, requireAluno, AlunoController.updateDadosComplementares);

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