import { Request, Response } from 'express';
import { AlunoService } from '../services/alunoService';
import { AuthRequest } from "../middleware/authMiddleware";

export class AlunoController {
    public static async register(req: Request, res: Response): Promise<Response> {
        try {
            const { nome, matricula, email, senha } = req.body;

            if (!nome || !matricula || !email || !senha) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos os campos são obrigatórios'
                });
            }

            const result = await AlunoService.registerAluno({ nome, matricula, email, senha });
            const status = result.success ? 201 : 400

            return res
                .status(status)
                .json(result);

        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    public static async updateDadosComplementares(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const authId = req.user!.id;
            const idTranslate = await AlunoService.getAlunoIdByAuthId(authId)

            if (!idTranslate.success || idTranslate.alunoId === undefined) {
                return res.status(404).json({
                    success: false,
                    message: idTranslate.message || "Aluno não encontrado."
                });
            }
            const alunoId = idTranslate.alunoId;

            const result = await AlunoService.updateDadosComplementares(alunoId, req.body);
            const status = result.success ? 200 : 400

            return res
                .status(status)
                .json(result)

        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    public static async getMeusDados(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const authId = req.user!.id;
            const result = await AlunoService.getMeusDados(authId);
            const status = result.success ? 200 : 404

            return res
                .status(status)
                .json(result)
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    public static async getAlunoById(req: Request, res: Response): Promise<Response> {
        try {
            const idAluno = req.params.id;
            const idConversionStringToNumber: number = Number(idAluno);

            if (isNaN(idConversionStringToNumber) || idConversionStringToNumber <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Id inválido."
                });
            }

            const result = await AlunoService.getAlunoById(idConversionStringToNumber);
            const status = result.success ? 200 : 404

            return res
                .status(status)
                .json(result)

        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    public static async getAlunoByEmail(req: Request, res: Response): Promise<Response> {
        try {
            if (Array.isArray(req.params.email)) {
                return res.status(400).json({
                    success: false,
                    message: "Formato de email inválido."
                }); //Nunca usei isso, mas basicamente verifica se o que está chegando é uma lista ou não
                //É pq o express 5+ está com essa vissaria de ser cauteloso, ele foi generalizado pra aceitar tanto uma string única quanto um array de strings
                //Aqui é só pra verificar se tem mais de um email chegando e evitar isso

            }
            const emailAluno = req.params.email;
            const result = await AlunoService.getAlunoByEmail(emailAluno);
            const status = result.success ? 200 : 404

            return res
                .status(status)
                .json(result)

        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    public static async getAlunoByMatricula(req: Request, res: Response): Promise<Response> {
        try {
            if (Array.isArray(req.params.matricula)) {
                return res.status(400).json({
                    success: false,
                    message: "Formato de matrícula inválido."
                });
            }

            const matricula = req.params.matricula;
            const result = await AlunoService.getAlunoByMatricula(matricula);
            const status = result.success ? 200 : 404;

            return res
                .status(status)
                .json(result);
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    public static async getAllAlunos(req: Request, res: Response): Promise<Response> {
        try {
            if (req.query.page && (typeof req.query.page !== "string")) {
                return res.status(400).json({
                    success: false,
                    message: "Formato de página inválido."
                });
            }

            if (req.query.limit && (typeof req.query.limit !== "string")) {
                return res.status(400).json({
                    success: false,
                    message: "Formato de limite inválido"
                });
            }

            const page = req.query.page ? parseInt(req.query.page, 10) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

            const result = await AlunoService.getAllAlunos(page, limit);
            const status = result.success ? 200 : 404;

            return res
                .status(status)
                .json(result);
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}
