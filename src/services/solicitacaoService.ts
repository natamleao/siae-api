import prisma from "../config/database";
import { SolicitacaoRepository } from "../repository/solicitacaoRepository";

export class SolicitacaoService {
  public static async iniciarSolicitacao(alunoId: number, auxilioId: number) {
    if (!auxilioId || isNaN(auxilioId)) {
      return { success: false, statusCode: 400, message: "ID do auxílio é obrigatório." };
    }

    // 1. Verifica se o auxílio existe
    const auxilio = await prisma.auxilio.findUnique({
      where: { id: auxilioId },
    });

    if (!auxilio) {
      return { success: false, statusCode: 404, message: "Auxílio não encontrado." };
    }

    // 2. Se já existe um rascunho em andamento para este auxílio, reaproveita-o
    const rascunhoExistente = await SolicitacaoRepository.findRascunho(alunoId, auxilioId);
    if (rascunhoExistente) {
      return {
        success: true,
        statusCode: 200,
        message: "Rascunho existente recuperado.",
        data: rascunhoExistente,
      };
    }

    // 3. Cria novo rascunho
    const novaSolicitacao = await SolicitacaoRepository.create(alunoId, auxilioId);

    return {
      success: true,
      statusCode: 201,
      message: "Solicitação iniciada com sucesso.",
      data: novaSolicitacao,
    };
  }
}
