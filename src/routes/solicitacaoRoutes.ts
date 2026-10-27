import { Router } from "express";
import { authenticate, requireAluno } from "../middleware/authMiddleware";
import { SolicitacaoController } from "../controllers/solicitacaoController";

const router = Router();

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
 *               - situacaoMoradia
 *               - condicaoMoradia
 *               - logradouro
 *               - numero
 *               - bairro
 *               - municipio
 *               - estado
 *             properties:
 *               situacaoMoradia: { type: string, example: "PROPRIA" }
 *               situacaoMoradiaOutro: { type: string, nullable: true, example: null }
 *               condicaoMoradia: { type: string, example: "MORA_COM_FAMILIA" }
 *               condicaoMoradiaOutro: { type: string, nullable: true, example: null }
 *               logradouro: { type: string, example: "Rua das Flores" }
 *               numero: { type: string, example: "123" }
 *               complemento: { type: string, nullable: true, example: "Apt 101" }
 *               bairro: { type: string, example: "Centro" }
 *               municipio: { type: string, example: "Natal" }
 *               estado: { type: string, example: "RN" }
 *               cep: { type: string, nullable: true, example: "59000-000" }
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

export default router;
