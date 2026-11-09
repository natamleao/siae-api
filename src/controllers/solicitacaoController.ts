import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { EnderecoService } from "../services/enderecoService";
import { SolicitacaoService } from "../services/solicitacaoService";
import { SituacaoVidaService } from "../services/situacaoVidaService";

export class SolicitacaoController {
  public static async iniciarSolicitacao(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const authId = req.user!.id;
      const auxilioId = Number(req.body.auxilioId);

      const result = await SolicitacaoService.iniciarSolicitacao(authId, auxilioId);
      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        ...("data" in result && { data: result.data }),
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async salvarIdentificacaoPessoal(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const authId = req.user!.id;
      const solicitacaoId = Number(req.params.id);

      if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
        return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
      }

      const result = await SolicitacaoService.salvarIdentificacaoPessoal(solicitacaoId, authId, req.body);
      const status = result.statusCode || (result.success ? 200 : 400);

      return res.status(status).json(result);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async salvarDadosAcademicos(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const authId = req.user!.id;
      const solicitacaoId = Number(req.params.id);

      if (isNaN(solicitacaoId) || solicitacaoId <= 0) {
        return res.status(400).json({ success: false, message: "ID de solicitação inválido." });
      }

      const result = await SolicitacaoService.salvarDadosAcademicos(solicitacaoId, authId, req.body);
      const status = result.statusCode || (result.success ? 200 : 400);

      return res.status(status).json(result);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async salvarEndereco(req: AuthRequest, res: Response): Promise<Response> {
    try {
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
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async salvarSituacoesVida(req: AuthRequest, res: Response): Promise<Response> {
    try {
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
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async obterSituacoesVida(req: AuthRequest, res: Response): Promise<Response> {
    try {
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
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async salvarRelato(req: AuthRequest, res: Response): Promise<Response> {
    try {
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
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async obterRelato(req: AuthRequest, res: Response): Promise<Response> {
    try {
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
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
