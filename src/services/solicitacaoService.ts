import { SolicitacaoRepository } from "../repository/solicitacaoRepository";
import { AuxilioRepository } from "../repository/auxilioRepository";
import { AlunoRepository } from "../repository/alunoRepository";
import { AlunoService } from "./alunoService";
import { IdentificacaoPessoalData, DadosAcademicosData } from "../models/alunoModel";
import { StatusSolicitacao } from "@prisma/client";

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

  public static async obterIdentificacaoPessoal(solicitacaoId: number, authId: number) {
    const acesso = await SolicitacaoService.validarAcessoSolicitacao(solicitacaoId, authId);
    if (!acesso.success || !acesso.aluno) {
      return acesso;
    }

    const aluno = acesso.aluno;
    return {
      success: true,
      statusCode: 200,
      message: "Identificação pessoal obtida com sucesso.",
      data: {
        nome: aluno.nome,
        cpf: aluno.cpf,
        rg: aluno.rg,
        dataNasc: aluno.dataNasc,
        telefone: aluno.telefone,
        emailContato: aluno.emailContato,
        tipoResponsavel: aluno.tipoResponsavel,
        tipoResponsavelOutro: aluno.tipoResponsavelOutro,
        nomeResponsavel: aluno.nomeResponsavel,
        sexo: aluno.sexo,
        identidadeGenero: aluno.identidadeGenero,
        identidadeGeneroOutro: aluno.identidadeGeneroOutro,
        orientacaoSexual: aluno.orientacaoSexual,
        orientacaoSexualOutro: aluno.orientacaoSexualOutro,
        etniaRaca: aluno.etniaRaca,
        estadoCivil: aluno.estadoCivil,
        tipoDeficiencia: aluno.tipoDeficiencia,
        tipoDeficienciaOutro: aluno.tipoDeficienciaOutro,
      },
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

  public static async obterDadosAcademicos(solicitacaoId: number, authId: number) {
    const acesso = await SolicitacaoService.validarAcessoSolicitacao(solicitacaoId, authId);
    if (!acesso.success || !acesso.aluno) {
      return acesso;
    }

    const aluno = acesso.aluno;
    return {
      success: true,
      statusCode: 200,
      message: "Dados acadêmicos obtidos com sucesso.",
      data: {
        matricula: aluno.matricula,
        curso: aluno.curso,
        turno: aluno.turno,
        tipoIngresso: aluno.tipoIngresso,
        anoIngresso: aluno.anoIngresso,
        semestreAtual: aluno.semestreAtual,
        recebeuAuxilioGraduacao: aluno.recebeuAuxilioGraduacao,
        auxilioGraduacaoDescricao: aluno.auxilioGraduacaoDescricao,
      },
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

  public static async obterSolicitacaoPorId(solicitacaoId: number) {
    const solicitacao = await SolicitacaoRepository.findByIdWithDetails(solicitacaoId);
    if (!solicitacao) {
      return { success: false, statusCode: 404, message: "Solicitação não encontrada." };
    }

    return {
      success: true,
      statusCode: 200,
      message: "Solicitação obtida com sucesso.",
      data: solicitacao,
    };
  }

  public static async listarSolicitacoes(
    page: number = 1,
    limit: number = 10,
    filters?: { status?: StatusSolicitacao; auxilioId?: number; alunoId?: number }
  ) {
    const result = await SolicitacaoRepository.findAll(page, limit, filters);
    return {
      success: true,
      statusCode: 200,
      message: "Solicitações recuperadas com sucesso.",
      data: result,
    };
  }
}
