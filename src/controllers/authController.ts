import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { AlunoService } from "../services/alunoService";
import { ForgotPasswordData } from "../models/models";

export class AuthController {
    public static async forgotPassword(
        req: Request,
        res: Response,
    ): Promise<Response> {
        const data: ForgotPasswordData = req.body;

        if (!data.identifier) {
            return res
                .status(400)
                .json({ success: false, message: "Identificador é obrigatório" });
        }

        const result = await AuthService.forgotPassword(data);

        return res
            .status(200)
            .json({ success: result.success, message: result.message });
    }

    public static async resetPassword(
        req: Request,
        res: Response,
    ): Promise<Response> {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Token e nova senha são obrigatórios",
                });
        }

        const result = await AuthService.resetPassword({
            token,
            newPassword,
        });

        const status = result.success ? 200 : 400;

        return res
            .status(status)
            .json({ success: result.success, message: result.message });
    }

    public static async login(req: Request, res: Response): Promise<Response> {
        const email = req.body.email || req.body.username;
        const password = req.body.password || req.body.senha;

        if (!email || !password) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Email/Usuário e senha são obrigatórios",
                });
        }

        const result = await AuthService.authenticate({ email, password });
        const status = result.success ? 200 : 401;

        if (result.success && result.token) {
            res.cookie('authToken', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
        }

        return res.status(status).json({
            access_token: result.token,
            token_type: "bearer",
            expires_in: 7 * 24 * 60 * 60, // 7 dias em segundos
            success: result.success,
            message: result.success
                ? "Login realizado com sucesso"
                : result.message,
            token: result.token,
            ...(result.user && { user: result.user }),
        });
    }

    public static async register(
        req: Request,
        res: Response,
    ): Promise<Response> {
        const { nome, matricula, email, password } = req.body ?? {};

        if (
            typeof nome !== "string" ||
            typeof matricula !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Nome, matrícula, email e senha são obrigatórios",
            });
        }

        const result = await AlunoService.registerAluno({
            nome,
            matricula,
            email,
            senha: password,
        });

        const statusByCode: Record<string, number> = {
            INVALID_DATA: 400,
            EMAIL_EXISTS: 409,
            MATRICULA_EXISTS: 409,
            INTERNAL_ERROR: 500
        };

        const status = result.success
            ? 201
            : result.code
                ? statusByCode[result.code] ?? 500
                : 400;

        if (result.success && result.data) {
            res.cookie("authToken", result.data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }

        return res.status(status).json({
            success: result.success,
            message: result.message,
            ...(result.success && result.data
                ? {
                    user: {
                        id: result.data.authId,
                        email: result.data.email,
                        permissao: result.data.permissao,
                    },
                }
                : {}),
        });
    }
}