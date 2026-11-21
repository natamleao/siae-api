import { Request, Response } from "express";
import { AuxilioService } from "../services/auxilioService";

export class AuxilioController {
    // Listar todos os auxílios (Alunos e Funcionários podem acessar)
    public static async listar(req: Request, res: Response): Promise<Response> {
        const result = await AuxilioService.listarTodos();
        return res.status(200).json(result);
    }

    // Criar novo auxílio (Apenas Administrador / Funcionário)
    public static async criar(req: Request, res: Response): Promise<Response> {
        const { nome, tipoAuxilio, descricao } = req.body;
        const result = await AuxilioService.criarAuxilio({ nome, tipoAuxilio, descricao });

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            data: result.data
        });
    }
}