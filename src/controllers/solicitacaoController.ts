import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { AlunoRepository } from "../repository/alunoRepository";
import { EnderecoService } from "../services/enderecoService";
import { SolicitacaoService } from "../services/solicitacaoService";

export class SolicitacaoController {
    public static async iniciarSolicitacao(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const authId = req.user!.id;
      const auxilioId = Number(req.body.auxilioId);
      const aluno = await AlunoRepository.findAlunoByAuthId(authId);
      if (!aluno) {
        return res.status(404).json({ success: false, message: "Aluno não encontrado." });
      }
      const result = await SolicitacaoService.iniciarSolicitacao(aluno.id, auxilioId);
      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
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

      // Descobre o alunoId a partir do authId logado
      const aluno = await AlunoRepository.findAlunoByAuthId(authId);
      if (!aluno) {
        return res.status(404).json({ success: false, message: "Aluno não encontrado." });
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
        aluno.id,
        payload
      );

      return res.status(result.statusCode).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
