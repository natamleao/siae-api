import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { FuncionarioService } from "../services/funcionarioService";

export class FuncionarioController {
    public static async register(req: AuthRequest, res: Response): Promise<Response> {
        if (
            typeof req.body !== "object" ||
            req.body === null ||
            Array.isArray(req.body)
        ) {
            return res.status(400).json({
                success: false,
                message: "Corpo da requisição inválido"
            });
        }

        const { nome, siape, email, senha, permissao } = req.body;
        const adminId = req.user!.id;

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            typeof nome !== "string" ||
            nome.trim().length < 1 ||
            nome.trim().length > 50
        ) {
            return res.status(400).json({
                success: false,
                message: "Nome deve ter entre 1 e 50 caracteres"
            });
        }

        if (
            typeof siape !== "number" ||
            !Number.isInteger(siape) ||
            siape <= 0 ||
            siape > 2147483647
        ) {
            return res.status(400).json({
                success: false,
                message: "SIAPE deve ser um número inteiro positivo de até 2147483647"
            });
        }

        if (
            typeof email !== "string" ||
            !regexEmail.test(email.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Email inválido"
            });
        }

        if (typeof senha !== "string" || senha.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Senha inválida"
            });
        }

        if (
            permissao !== "TECNICO" &&
            permissao !== "ASSISTENTE"
        ) {
            return res.status(400).json({
                success: false,
                message: "Permissão inválida para cadastro de funcionário"
            });
        }

        const result = await FuncionarioService.registerFuncionario(
            { nome, siape, email, senha, permissao },
            adminId
        );

        if (result.success) {
            return res.status(201).json(result);
        }

        const statusByCode: Record<string, number> = {
            INVALID_PERMISSION: 400,
            INVALID_PASSWORD: 400,
            FORBIDDEN: 403,
            EMAIL_EXISTS: 409,
            SIAPE_EXISTS: 409,
            INTERNAL_ERROR: 500,
        };

        const status = result.code
            ? statusByCode[result.code] ?? 500
            : 400;

        return res.status(status).json(result);
    }

    public static async getMeuPerfil(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const result = await FuncionarioService.buscarMeuPerfil(authId);
        return res.status(200).json(result);
    }
}