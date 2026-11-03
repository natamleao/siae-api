import { Router } from "express";
import { OpcoesController } from "../controllers/opcoesController";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Opções
 *   description: Opções para preenchimento dos formulários do front-end
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Opcao:
 *       type: object
 *       properties:
 *         valor:
 *           type: string
 *           description: Valor técnico enviado de volta pelo front-end
 *           example: PROPRIA
 *         rotulo:
 *           type: string
 *           description: Texto exibido ao usuário
 *           example: Própria
 *     OpcoesFormularioResponse:
 *       type: object
 *       properties:
 *         situacoesMoradia:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Opcao'
 *         condicoesMoradia:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Opcao'
 *         situacoesOcupacionais:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Opcao'
 */

/**
 * @openapi
 * /opcoes/formulario:
 *   get:
 *     summary: Listar opções dos campos de seleção do formulário
 *     tags: [Opções]
 *     description: Retorna as opções de moradia e ocupação em pares valor/rótulo.
 *     responses:
 *       200:
 *         description: Opções retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpcoesFormularioResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/formulario", OpcoesController.obterOpcoesFormulario);

export default router;