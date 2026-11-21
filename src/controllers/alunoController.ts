import { Request, Response } from 'express';
import { AlunoService } from '../services/alunoService';
import { AuthRequest } from "../middleware/authMiddleware";
import { IdentificacaoPessoalData, DadosAcademicosData } from '../models/alunoModel';

export class AlunoController {
    public static async register(req: Request, res: Response): Promise<Response> {
        const { nome, matricula, email, senha } = req.body ?? {};

        const result = await AlunoService.registerAluno({
            nome,
            matricula,
            email,
            senha
        });

        if (result.success) {
            return res.status(201).json(result);
        }

        const statusByCode: Record<string, number> = {
            INVALID_DATA: 400,
            EMAIL_EXISTS: 409,
            MATRICULA_EXISTS: 409,
            INTERNAL_ERROR: 500
        };

        const status = result.code
            ? statusByCode[result.code] ?? 500
            : 400;

        return res.status(status).json(result);
    }

    public static async getMeusDados(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const result = await AlunoService.getMeusDados(authId);
        const status = result.success ? 200 : 404;

        return res.status(status).json(result);
    }

    public static async getAlunoById(req: Request, res: Response): Promise<Response> {
        const idAluno = req.params.id;
        const idConversionStringToNumber: number = Number(idAluno);

        if (isNaN(idConversionStringToNumber) || idConversionStringToNumber <= 0) {
            return res.status(400).json({
                success: false,
                message: "Id inválido."
            });
        }

        const result = await AlunoService.getAlunoById(idConversionStringToNumber);
        const status = result.success ? 200 : 404;

        return res.status(status).json(result);
    }

    public static async getAlunoByEmail(req: Request, res: Response): Promise<Response> {
        if (Array.isArray(req.params.email)) {
            return res.status(400).json({
                success: false,
                message: "Formato de email inválido."
            });
        }

        const emailAluno = req.params.email;
        const result = await AlunoService.getAlunoByEmail(emailAluno);
        const status = result.success ? 200 : 404;

        return res.status(status).json(result);
    }

    public static async getAlunoByMatricula(req: Request, res: Response): Promise<Response> {
        if (Array.isArray(req.params.matricula)) {
            return res.status(400).json({
                success: false,
                message: "Formato de matrícula inválido."
            });
        }

        const matricula = req.params.matricula;
        const result = await AlunoService.getAlunoByMatricula(matricula);
        const status = result.success ? 200 : 404;

        return res.status(status).json(result);
    }

    public static async getAllAlunos(req: Request, res: Response): Promise<Response> {
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

        return res.status(status).json(result);
    }

    public static async salvarIdentificacaoPessoal(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const {
            nome,
            cpf,
            rg,
            dataNasc,
            telefone,
            emailContato,
            tipoResponsavel,
            tipoResponsavelOutro,
            nomeResponsavel,
            sexo,
            identidadeGenero,
            identidadeGeneroOutro,
            orientacaoSexual,
            orientacaoSexualOutro,
            etniaRaca,
            estadoCivil,
            tipoDeficiencia,
            tipoDeficienciaOutro
        } = req.body;

        const dados: IdentificacaoPessoalData = {
            nome, cpf, rg, dataNasc, telefone, emailContato,
            tipoResponsavel, tipoResponsavelOutro, nomeResponsavel,
            sexo, identidadeGenero, identidadeGeneroOutro,
            orientacaoSexual, orientacaoSexualOutro,
            etniaRaca, estadoCivil, tipoDeficiencia, tipoDeficienciaOutro
        };

        const result = await AlunoService.salvarIdentificacaoPessoal(authId, dados);
        const status = result.success ? 200 : 400;

        return res.status(status).json(result);
    }

    public static async salvarDadosAcademicos(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const {
            matricula,
            curso,
            turno,
            tipoIngresso,
            anoIngresso,
            semestreAtual,
            recebeuAuxilioGraduacao,
            auxilioGraduacaoDescricao
        } = req.body;

        const dados: DadosAcademicosData = {
            matricula,
            curso,
            turno,
            tipoIngresso,
            anoIngresso,
            semestreAtual,
            recebeuAuxilioGraduacao,
            auxilioGraduacaoDescricao
        };

        const result = await AlunoService.salvarDadosAcademicos(authId, dados);
        const status = result.success ? 200 : 400;

        return res.status(status).json(result);
    }
}