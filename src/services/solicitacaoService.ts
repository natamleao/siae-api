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

  public static async salvarRelato(solicitacaoId: number, alunoId: number, relato: string) {
    // 1. Validar se a solicitação existe
    const solicitacao = await SolicitacaoRepository.findById(solicitacaoId);
    if (!solicitacao) {
      return { success: false, statusCode: 404, message: "Solicitação não encontrada." };
    }

    // 2. Validar permissão (aluno logado é o dono da solicitação)
    if (solicitacao.alunoId !== alunoId) {
      return {
        success: false,
        statusCode: 403,
        message: "Você não tem permissão para alterar esta solicitação.",
      };
    }

    // 3. Validar se o relato foi preenchido
    if (!relato || typeof relato !== "string" || relato.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: "O texto explicativo do relato pessoal é obrigatório.",
      };
    }

    // 4. Validar limite máximo de 2000 caracteres
    const relatoTratado = relato.trim();
    if (relatoTratado.length > 2000) {
      return {
        success: false,
        statusCode: 400,
        message: "O relato pessoal deve ter no máximo 2000 caracteres.",
      };
    }

    // 5. Atualizar no banco
    const solicitacaoAtualizada = await SolicitacaoRepository.updateRelato(
      solicitacaoId,
      relatoTratado
    );

    return {
      success: true,
      statusCode: 200,
      message: "Relato pessoal salvo com sucesso.",
      data: {
        id: solicitacaoAtualizada.id,
        relato: solicitacaoAtualizada.relato,
      },
    };
  }

  public static async obterRelato(solicitacaoId: number, alunoId: number) {
    const solicitacao = await SolicitacaoRepository.findById(solicitacaoId);
    if (!solicitacao) {
      return { success: false, statusCode: 404, message: "Solicitação não encontrada." };
    }

    if (solicitacao.alunoId !== alunoId) {
      return {
        success: false,
        statusCode: 403,
        message: "Você não tem permissão para visualizar esta solicitação.",
      };
    }

    return {
      success: true,
      statusCode: 200,
      message: "Relato pessoal obtido com sucesso.",
      data: {
        id: solicitacao.id,
        relato: solicitacao.relato,
      },
    };
  }
}
