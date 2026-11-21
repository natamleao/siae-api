import { Request, Response } from "express";
import { OpcoesService } from "../services/opcoesService";

export class OpcoesController {
    static obterOpcoesFormulario(req: Request, res: Response) {
        const opcoes = OpcoesService.obterOpcoesFormulario();
        return res.status(200).json(opcoes);
    }
}