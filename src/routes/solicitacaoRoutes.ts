import { Router } from "express";
import { authenticate, requireAluno } from "../middleware/authMiddleware";
import { SolicitacaoController } from "../controllers/solicitacaoController";

const router = Router();

/**
 * @openapi
 * /solicitacao:
 *   post:
 *     summary: Iniciar uma nova solicitação de auxílio (cria rascunho)
 *     tags: [Solicitação]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - auxilioId
 *             properties:
 *               auxilioId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Solicitação criada em estado de rascunho
 *       200:
 *         description: Rascunho anterior recuperado
 */
router.post("/", authenticate, requireAluno, SolicitacaoController.iniciarSolicitacao);

/**
 * @openapi
 * /solicitacao/{id}/endereco:
 *   post:
 *     summary: Salvar ou atualizar endereço do aluno no fluxo da solicitação (Passo 2/8)
 *     tags: [Solicitação]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID da solicitação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoMoradia
 *               - condicaoMoradia
 *               - logradouro
 *               - numero
 *               - bairro
 *               - municipio
 *               - estado
 *               - origemFamilia
 *             properties:
 *               tipoMoradia: { type: string, example: "PROPRIA" }
 *               tipoMoradiaOutro: { type: string, nullable: true, example: null }
 *               condicaoMoradia: { type: string, example: "MORA_COM_FAMILIA" }
 *               condicaoMoradiaOutro: { type: string, nullable: true, example: null }
 *               logradouro: { type: string, example: "Rua das Flores" }
 *               numero: { type: string, example: "123" }
 *               complemento: { type: string, nullable: true, example: "Apt 101" }
 *               bairro: { type: string, example: "Centro" }
 *               municipio: { type: string, example: "Natal" }
 *               estado: { type: string, example: "RN" }
 *               origemFamilia: {type: string, example: "Limoeiro do Norte"}
 *     responses:
 *       200:
 *         description: Endereço salvo com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Não autorizado a alterar esta solicitação
 *       404:
 *         description: Solicitação ou aluno não encontrado
 */
router.post("/:id/endereco", authenticate, requireAluno, SolicitacaoController.salvarEndereco);
// Se quiser suportar PUT/PATCH para seguir a boa prática da dica do dev:
router.patch("/:id/endereco", authenticate, requireAluno, SolicitacaoController.salvarEndereco);

/**
 * @openapi
 * /solicitacao/{id}/identificacao-pessoal:
 *   post:
 *     summary: Salvar ou atualizar identificação pessoal do aluno no fluxo da solicitação (Passo 1/8)
 *     tags: [Solicitação]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID da solicitação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Todos os campos são opcionais para suportar rascunho
 *     responses:
 *       200:
 *         description: Identificação pessoal salva com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Não autorizado a alterar esta solicitação
 *       404:
 *         description: Solicitação ou aluno não encontrado
 */
router.post("/:id/identificacao-pessoal", authenticate, requireAluno, SolicitacaoController.salvarIdentificacaoPessoal);
router.patch("/:id/identificacao-pessoal", authenticate, requireAluno, SolicitacaoController.salvarIdentificacaoPessoal);

/**
 * @openapi
 * /solicitacao/{id}/dados-academicos:
 *   post:
 *     summary: Salvar ou atualizar dados acadêmicos do aluno no fluxo da solicitação (Passo 3/8)
 *     tags: [Solicitação]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID da solicitação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               curso: { type: string, example: "Engenharia de Software" }
 *               turno: { type: string, enum: [MATUTINO, VESPERTINO, NOTURNO, INTEGRAL], example: "INTEGRAL" }
 *               tipoIngresso: { type: string, example: "Ampla Concorrência" }
 *               anoIngresso: { type: integer, example: 2024 }
 *               semestreAtual: { type: integer, example: 2 }
 *               recebeuAuxilioGraduacao: { type: boolean, example: true }
 *               auxilioGraduacaoDescricao: { type: string, example: "Auxílio Moradia 2024" }
 *     responses:
 *       200:
 *         description: Dados acadêmicos salvos com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Não autorizado a alterar esta solicitação
 *       404:
 *         description: Solicitação ou aluno não encontrado
 */
router.post("/:id/dados-academicos", authenticate, requireAluno, SolicitacaoController.salvarDadosAcademicos);
router.patch("/:id/dados-academicos", authenticate, requireAluno, SolicitacaoController.salvarDadosAcademicos);

export default router;
