import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { ForgotPasswordData, RegisterData, ResetPasswordData } from "../models/models";

const handleError = (res: Response, error: any) => {
    return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
    });
};

export class AuthController {
    public static async forgotPassword(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const data: ForgotPasswordData = req.body;
            if (!data.email) {
                return res
                    .status(400)
                    .json({ success: false, message: "Email é obrigatório" });
            }

            const result = await AuthService.forgotPassword(data);
            return res
                .status(200)
                .json({ success: result.success, message: result.message });
        } catch (error: any) {
            return handleError(res, error);
        }
    }

    public static async resetPassword(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
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
        } catch (error: any) {
            return handleError(res, error);
        }
    }

    public static async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Email e senha são obrigatórios",
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
                success: result.success,
                message: result.success
                    ? "Login realizado com sucesso"
                    : result.message,
                token: result.token,
                ...(result.user && { user: result.user }),
            });
        } catch (error: any) {
            return handleError(res, error);
        }
    }

    public static async register(
        req: Request,
        res: Response,
    ): Promise<Response> {
        try {
            const data: RegisterData = req.body;
            if (!data.email || !data.password) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "Email e senha são obrigatórios",
                    });
            }

            const result = await AuthService.register(data); // TODO consertar
            const status = result.success ? 201 : 400;

            if (result.success && result.token) {
                res.cookie('authToken', result.token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });
            }

            return res.status(status).json({
                success: result.success,
                message: result.message,
                ...(result.user && { user: result.user }),
            });
        } catch (error: any) {
            return handleError(res, error);
        }
    }
}
