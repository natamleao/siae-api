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
router.put("/:id/endereco", authenticate, requireAluno, SolicitacaoController.salvarEndereco);

/**
 * @openapi
 * /solicitacao/{id}/situacoes-vida:
 *   post:
 *     summary: Salvar ou atualizar situações que podem impactar a vida do aluno (Passo 6/8)
 *     tags: [Solicitação]
 *     description: >
 *       Salva as respostas da Seção 6. Todas as perguntas são opcionais.
 *       Campos com texto descritivo (Outro/Outra) são limpos caso a respectiva opção não esteja marcada.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID da solicitação
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               situacoesSaude:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [DOENCA_CRONICA, DOENCA_GRAVE, DEFICIENCIA, USO_CONTINUO_MEDICAMENTO, OUTRA, NAO]
 *                 example: [DOENCA_CRONICA, USO_CONTINUO_MEDICAMENTO]
 *               situacaoSaudeOutra:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               situacoesViolencia:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [VIOLENCIA_DOMESTICA, VIOLENCIA_PSICOLOGICA, VIOLENCIA_COMUNIDADE_URBANA, OUTRA, NAO]
 *                 example: [NAO]
 *               situacaoViolenciaOutra:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               acessoTransporte:
 *                 type: string
 *                 enum: [NAO_TENHO_ACESSO, TRANSPORTE_PAGO_COM_DIFICULDADE, TRANSPORTE_PAGO_SEM_DIFICULDADE, TRANSPORTE_GRATUITO_COM_DIFICULDADE, TRANSPORTE_GRATUITO_SEM_DIFICULDADE]
 *                 example: TRANSPORTE_PAGO_SEM_DIFICULDADE
 *               identificacaoSituacao:
 *                 type: string
 *                 enum: [GESTANTE, TEM_FILHOS, NAO]
 *                 example: NAO
 *               situacaoFamiliarInstavel:
 *                 type: string
 *                 enum: [SIM, NAO]
 *                 example: NAO
 *               programaSocial:
 *                 type: string
 *                 enum: [BOLSA_FAMILIA, BPC_LOAS, SEGURO_SAFRA, OUTRO, NAO]
 *                 example: BOLSA_FAMILIA
 *               programaSocialOutro:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *     responses:
 *       200:
 *         description: Situações de vida salvas com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Não autorizado a alterar esta solicitação
 *       404:
 *         description: Solicitação ou aluno não encontrado
 *   put:
 *     summary: Atualizar situações que podem impactar a vida do aluno (Passo 6/8)
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
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/paths/~1solicitacao~1{id}~1situacoes-vida/post/requestBody/content/application~1json/schema'
 *     responses:
 *       200:
 *         description: Situações de vida salvas com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Não autorizado a alterar esta solicitação
 *       404:
 *         description: Solicitação ou aluno não encontrado
 *   get:
 *     summary: Obter situações que podem impactar a vida salvas pelo aluno (Passo 6/8)
 *     tags: [Solicitação]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID da solicitação
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso
 *       403:
 *         description: Não autorizado a visualizar esta solicitação
 *       404:
 *         description: Solicitação ou aluno não encontrado
 */
router.post("/:id/situacoes-vida", authenticate, requireAluno, SolicitacaoController.salvarSituacoesVida);
router.put("/:id/situacoes-vida", authenticate, requireAluno, SolicitacaoController.salvarSituacoesVida);
router.get("/:id/situacoes-vida", authenticate, requireAluno, SolicitacaoController.obterSituacoesVida);

/**
 * @openapi
 * /solicitacao/{id}/relato:
 *   post:
 *     summary: Salvar ou atualizar o relato pessoal da solicitação (Passo 7/8)
 *     tags: [Solicitação]
 *     description: >
 *       Salva o relato pessoal / texto explicativo da solicitação de auxílio.
 *       O campo é obrigatório e aceita texto livre de até 2000 caracteres.
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
 *               - relato
 *             properties:
 *               relato:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Texto explicativo com os detalhes da situação e motivos da solicitação
 *                 example: "Sou estudante do curso de Engenharia de Software e resido longe da universidade..."
 *     responses:
 *       200:
 *         description: Relato pessoal salvo com sucesso
 *       400:
 *         description: Texto não informado ou excedeu 2000 caracteres
 *       403:
 *         description: Não autorizado a alterar esta solicitação
 *       404:
 *         description: Solicitação não encontrada
 *   put:
 *     summary: Atualizar o relato pessoal da solicitação (Passo 7/8)
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
 *             $ref: '#/paths/~1solicitacao~1{id}~1relato/post/requestBody/content/application~1json/schema'
 *     responses:
 *       200:
 *         description: Relato pessoal atualizado com sucesso
 *       400:
 *         description: Texto não informado ou excedeu 2000 caracteres
 *       403:
 *         description: Não autorizado a alterar esta solicitação
 *       404:
 *         description: Solicitação não encontrada
 *   get:
 *     summary: Obter o relato pessoal da solicitação (Passo 7/8)
 *     tags: [Solicitação]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID da solicitação
 *     responses:
 *       200:
 *         description: Relato pessoal recuperado com sucesso
 *       403:
 *         description: Não autorizado a visualizar esta solicitação
 *       404:
 *         description: Solicitação não encontrada
 */
router.post("/:id/relato", authenticate, requireAluno, SolicitacaoController.salvarRelato);
router.put("/:id/relato", authenticate, requireAluno, SolicitacaoController.salvarRelato);
router.get("/:id/relato", authenticate, requireAluno, SolicitacaoController.obterRelato);
export default router;
