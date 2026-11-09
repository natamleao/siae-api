import { SolicitacaoRepository } from "../repository/solicitacaoRepository";
import { AuxilioRepository } from "../repository/auxilioRepository";
import { AlunoRepository } from "../repository/alunoRepository";
import { AlunoService } from "./alunoService";
import { IdentificacaoPessoalData, DadosAcademicosData } from "../models/alunoModel";

export class SolicitacaoService {
  public static async iniciarSolicitacao(authId: number, auxilioId: number) {
    if (!auxilioId || isNaN(auxilioId)) {
      return { success: false, statusCode: 400, message: "ID do auxílio é obrigatório." };
    }

    // 1. Descobre o aluno a partir do authId
    const aluno = await AlunoRepository.findAlunoByAuthId(authId);
    if (!aluno) {
      return { success: false, statusCode: 404, message: "Aluno não encontrado." };
    }

    // 2. Verifica se o auxílio existe
    const auxilio = await AuxilioRepository.findById(auxilioId);
    if (!auxilio) {
      return { success: false, statusCode: 404, message: "Auxílio não encontrado." };
    }

    // 3. Se já existe um rascunho em andamento para este auxílio, reaproveita-o
    const rascunhoExistente = await SolicitacaoRepository.findRascunho(aluno.id, auxilioId);
    if (rascunhoExistente) {
      return {
        success: true,
        statusCode: 200,
        message: "Rascunho existente recuperado.",
        data: rascunhoExistente,
      };
    }

    // 4. Cria novo rascunho
    const novaSolicitacao = await SolicitacaoRepository.create(aluno.id, auxilioId);

    return {
      success: true,
      statusCode: 201,
      message: "Solicitação iniciada com sucesso.",
      data: novaSolicitacao,
    };
  }

  public static async validarAcessoSolicitacao(solicitacaoId: number, authId: number) {
    const aluno = await AlunoRepository.findAlunoByAuthId(authId);
    if (!aluno) {
      return { success: false, statusCode: 404, message: "Aluno não encontrado." };
    }

    const solicitacao = await SolicitacaoRepository.findById(solicitacaoId);
    if (!solicitacao) {
      return { success: false, statusCode: 404, message: "Solicitação não encontrada." };
    }

    if (solicitacao.alunoId !== aluno.id) {
      return {
        success: false,
        statusCode: 403,
        message: "Você não tem permissão para alterar esta solicitação.",
      };
    }

    return { success: true, statusCode: 200, aluno, solicitacao };
  }

  public static async salvarIdentificacaoPessoal(
    solicitacaoId: number,
    authId: number,
    dados: IdentificacaoPessoalData
  ) {
    const acesso = await SolicitacaoService.validarAcessoSolicitacao(solicitacaoId, authId);
    if (!acesso.success || !acesso.aluno) {
      return acesso;
    }

    const result = await AlunoService.salvarIdentificacaoPessoal(acesso.aluno.id, dados);
    return {
      ...result,
      statusCode: result.success ? 200 : 400,
    };
  }

  public static async salvarDadosAcademicos(
    solicitacaoId: number,
    authId: number,
    dados: DadosAcademicosData
  ) {
    const acesso = await SolicitacaoService.validarAcessoSolicitacao(solicitacaoId, authId);
    if (!acesso.success || !acesso.aluno) {
      return acesso;
    }

    const result = await AlunoService.salvarDadosAcademicos(acesso.aluno.id, dados);
    return {
      ...result,
      statusCode: result.success ? 200 : 400,
    };
  }

  public static async salvarRelato(solicitacaoId: number, authId: number, relato: string) {
    const acesso = await SolicitacaoService.validarAcessoSolicitacao(solicitacaoId, authId);
    if (!acesso.success) {
      return acesso;
    }

    // Validar se o relato foi preenchido
    if (!relato || typeof relato !== "string" || relato.trim().length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: "O texto explicativo do relato pessoal é obrigatório.",
      };
    }

    // Validar limite máximo de 2000 caracteres
    const relatoTratado = relato.trim();
    if (relatoTratado.length > 2000) {
      return {
        success: false,
        statusCode: 400,
        message: "O relato pessoal deve ter no máximo 2000 caracteres.",
      };
    }

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

  public static async obterRelato(solicitacaoId: number, authId: number) {
    const aluno = await AlunoRepository.findAlunoByAuthId(authId);
    if (!aluno) {
      return { success: false, statusCode: 404, message: "Aluno não encontrado." };
    }

    const solicitacao = await SolicitacaoRepository.findById(solicitacaoId);
    if (!solicitacao) {
      return { success: false, statusCode: 404, message: "Solicitação não encontrada." };
    }

    if (solicitacao.alunoId !== aluno.id) {
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
