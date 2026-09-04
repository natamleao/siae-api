import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { logout } from "../middleware/authMiddleware";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Endpoints de Autenticação e Gestão de Acesso
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário (Login / OAuth2 Token)
 *     tags: [Auth]
 *     description: Realiza a autenticação do usuário e retorna o token JWT e cookies de sessão. Suporta JSON e formulário OAuth2 (Password Flow).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Email do usuário
 *                 example: admin@siae.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Senha do usuário
 *                 example: 123456
 *               grant_type:
 *                 type: string
 *                 example: password
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Email/Usuário e senha são obrigatórios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post("/login", AuthController.login);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post("/register", AuthController.register);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: Instruções de recuperação enviadas se o email existir
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Email é obrigatório
 */
router.post("/forgot-password", AuthController.forgotPassword);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Redefinir senha com token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Token inválido, expirado ou senha curta
 */
router.post("/reset-password", AuthController.resetPassword);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Encerrar sessão (Logout)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post("/logout", logout);

export default router;
