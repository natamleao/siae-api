import { Request, Response } from "express";
import { OpcoesService } from "../services/opcoesService";

export class OpcoesController {
  static obterOpcoesFormulario(req: Request, res: Response) {
    try {
      const opcoes = OpcoesService.obterOpcoesFormulario();
      return res.status(200).json(opcoes);
    } catch (error) {
      console.error("Erro ao obter opções do formulário:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno ao obter opções do formulário",
      });
    }
  }
}