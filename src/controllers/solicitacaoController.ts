import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { EnderecoService } from "../services/enderecoService";
import { SolicitacaoService } from "../services/solicitacaoService";
import { SituacaoVidaService } from "../services/situacaoVidaService";

export class SolicitacaoController {
    public static async iniciarSolicitacao(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const auxilioId = Number(req.body.auxilioId);

        const result = await SolicitacaoService.iniciarSolicitacao(authId, auxilioId);
        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            ...("data" in result && { data: result.data }),
        });
    }

    public static async salvarIdentificacaoPessoal(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const solicitacaoId = Number(req.params.id);

        if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
            return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
        }

        const result = await SolicitacaoService.salvarIdentificacaoPessoal(solicitacaoId, authId, req.body);
        const status = result.statusCode || (result.success ? 200 : 400);

        return res.status(status).json(result);
    }

    public static async obterIdentificacaoPessoal(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const solicitacaoId = Number(req.params.id);

        if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
            return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
        }

        const result = await SolicitacaoService.obterIdentificacaoPessoal(solicitacaoId, authId);
        const status = result.statusCode || (result.success ? 200 : 400);

        return res.status(status).json(result);
    }

    public static async salvarDadosAcademicos(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const solicitacaoId = Number(req.params.id);

        if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
            return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
        }

        const result = await SolicitacaoService.salvarDadosAcademicos(solicitacaoId, authId, req.body);
        const status = result.statusCode || (result.success ? 200 : 400);

        return res.status(status).json(result);
    }

    public static async obterDadosAcademicos(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const solicitacaoId = Number(req.params.id);

        if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
            return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
        }

        const result = await SolicitacaoService.obterDadosAcademicos(solicitacaoId, authId);
        const status = result.statusCode || (result.success ? 200 : 400);

        return res.status(status).json(result);
    }

    public static async salvarEndereco(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const solicitacaoId = Number(req.params.id);

        if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
            return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
        }

        // Sanitização de strings
        const sanitizeString = (val: any) => (typeof val === "string" ? val.trim() : val);

        const payload = {
            tipoMoradia: req.body.tipoMoradia,
            tipoMoradiaOutro: sanitizeString(req.body.tipoMoradiaOutro),
            condicaoMoradia: req.body.condicaoMoradia,
            condicaoMoradiaOutro: sanitizeString(req.body.condicaoMoradiaOutro),
            logradouro: sanitizeString(req.body.logradouro),
            numero: sanitizeString(req.body.numero),
            complemento: sanitizeString(req.body.complemento) || null,
            bairro: sanitizeString(req.body.bairro),
            municipio: sanitizeString(req.body.municipio),
            estado: sanitizeString(req.body.estado),
            // cep: sanitizeString(req.body.cep) || null, //deixar comentado para casos futuros
            origemFamilia: sanitizeString(req.body.origemFamilia) || "",
        };

        const result = await EnderecoService.salvarEnderecoSolicitacao(
            solicitacaoId,
            authId,
            payload
        );

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            ...("data" in result && { data: result.data }),
        });
    }

    public static async obterEndereco(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const solicitacaoId = Number(req.params.id);

        if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
            return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
        }

        const result = await EnderecoService.obterEnderecoSolicitacao(solicitacaoId, authId);
        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            ...("data" in result && { data: result.data }),
        });
    }

    public static async salvarSituacoesVida(req: AuthRequest, res: Response): Promise<Response> {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({
                success: false,
                message: "Dados de situações de vida inválidos.",
            });
        }

        const authId = req.user!.id;
        const solicitacaoId = Number(req.params.id);

        if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
            return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
        }

        const sanitizeString = (val: any) => (typeof val === "string" ? val.trim() : val);

        const payload = {
            situacoesSaude: req.body.situacoesSaude,
            situacaoSaudeOutra: sanitizeString(req.body.situacaoSaudeOutra),
            situacoesViolencia: req.body.situacoesViolencia,
            situacaoViolenciaOutra: sanitizeString(req.body.situacaoViolenciaOutra),
            acessoTransporte: req.body.acessoTransporte,
            identificacaoSituacao: req.body.identificacaoSituacao,
            situacaoFamiliarInstavel: req.body.situacaoFamiliarInstavel,
            programaSocial: req.body.programaSocial,
            programaSocialOutro: sanitizeString(req.body.programaSocialOutro),
        };

        const result = await SituacaoVidaService.salvarSituacaoVidaSolicitacao(
            solicitacaoId,
            authId,
            payload
        );

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            ...("data" in result && { data: result.data }),
        });
    }

    public static async obterSituacoesVida(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const solicitacaoId = Number(req.params.id);

        if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
            return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
        }

        const result = await SituacaoVidaService.obterSituacaoVidaSolicitacao(
            solicitacaoId,
            authId
        );

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            ...("data" in result && { data: result.data }),
        });
    }

    public static async salvarRelato(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const solicitacaoId = Number(req.params.id);

        if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
            return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
        }

        const relato = req.body.relato ?? req.body.relatoPessoal ?? req.body.texto;

        const result = await SolicitacaoService.salvarRelato(
            solicitacaoId,
            authId,
            relato
        );

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            ...("data" in result && { data: result.data }),
        });
    }

    public static async obterRelato(req: AuthRequest, res: Response): Promise<Response> {
        const authId = req.user!.id;
        const solicitacaoId = Number(req.params.id);

        if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
            return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
        }

        const result = await SolicitacaoService.obterRelato(solicitacaoId, authId);

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            ...("data" in result && { data: result.data }),
        });
    }

    public static async obterPorId(req: AuthRequest, res: Response): Promise<Response> {
        const solicitacaoId = Number(req.params.id);

        if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
            return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
        }

        const result = await SolicitacaoService.obterSolicitacaoPorId(solicitacaoId);
        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            ...("data" in result && { data: result.data }),
        });
    }

    public static async listar(req: AuthRequest, res: Response): Promise<Response> {
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const auxilioId = req.query.auxilioId ? parseInt(req.query.auxilioId as string, 10) : undefined;
        const alunoId = req.query.alunoId ? parseInt(req.query.alunoId as string, 10) : undefined;
        const status = req.query.status as any;

        if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
            return res.status(400).json({ success: false, message: "Parâmetros de paginação inválidos." });
        }

        const result = await SolicitacaoService.listarSolicitacoes(page, limit, {
            status,
            auxilioId: isNaN(auxilioId as number) ? undefined : auxilioId,
            alunoId: isNaN(alunoId as number) ? undefined : alunoId,
        });

        return res.status(result.statusCode).json({
            success: result.success,
            message: result.message,
            ...("data" in result && { data: result.data }),
        });
    }
}
