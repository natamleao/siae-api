import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { FuncionarioService } from "../services/funcionarioService";


export class FuncionarioController {
    public static async register(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const { nome, siape, email, senha, permissao } = req.body;
            const adminId = req.user!.id;

            if (!nome || !siape || !email || !senha || !permissao) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos os campos são obrigatórios'
                });

            }

            const result = await FuncionarioService.registerFuncionario(
                { nome, siape, email, senha, permissao },
                adminId
            );

            return res.status(201).json(result);

        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    public static async getMeuPerfil(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const authId = req.user!.id;
            const result = await FuncionarioService.buscarMeuPerfil(authId);
            return res.status(200).json(result);

        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}