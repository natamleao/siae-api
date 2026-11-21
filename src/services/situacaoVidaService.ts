import {
    SituacaoSaude,
    SituacaoViolencia,
    AcessoTransporte,
    IdentificacaoSituacao,
    SituacaoFamiliarInstavel,
    ProgramaSocial,
} from "@prisma/client";
import { SituacaoVidaRepository } from "../repository/situacaoVidaRepository";
import { SolicitacaoRepository } from "../repository/solicitacaoRepository";
import { AlunoRepository } from "../repository/alunoRepository";
import { SalvarSituacaoVidaDTO } from "../models/situacaoVidaModel";

export class SituacaoVidaService {
    public static async salvarSituacaoVidaSolicitacao(
        solicitacaoId: number,
        authId: number,
        dados: SalvarSituacaoVidaDTO
    ) {
        if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
            return {
                success: false,
                statusCode: 400,
                message: "Dados de situações de vida inválidos.",
            };
        }

        // 1. Descobrir aluno pelo authId
        const aluno = await AlunoRepository.findAlunoByAuthId(authId);
        if (!aluno) {
            return { success: false, statusCode: 404, message: "Aluno não encontrado." };
        }

        // 2. Validar se a solicitação existe e pertence ao aluno logado
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

        // 3. Validar os tipos dos campos recebidos
        if (
            dados.situacoesSaude !== undefined &&
            !Array.isArray(dados.situacoesSaude)
        ) {
            return { success: false, statusCode: 400, message: "Situações de saúde devem ser enviadas em uma lista." };
        }

        if (
            dados.situacoesViolencia !== undefined &&
            !Array.isArray(dados.situacoesViolencia)
        ) {
            return { success: false, statusCode: 400, message: "Situações de violência devem ser enviadas em uma lista." };
        }

        const camposTexto = [
            dados.situacaoSaudeOutra,
            dados.situacaoViolenciaOutra,
            dados.programaSocialOutro,
        ];

        if (camposTexto.some((valor) => valor !== undefined && valor !== null && typeof valor !== "string")) {
            return { success: false, statusCode: 400, message: "Os campos de descrição devem conter textos válidos." };
        }

        // 4. Validação dos enums
        if (dados.situacoesSaude && Array.isArray(dados.situacoesSaude)) {
            const valoresValidos = Object.values(SituacaoSaude);
            const invalido = dados.situacoesSaude.some((s) => !valoresValidos.includes(s));
            if (invalido) {
                return { success: false, statusCode: 400, message: "Opção inválida em situação de saúde." };
            }
        }

        if (dados.situacoesViolencia && Array.isArray(dados.situacoesViolencia)) {
            const valoresValidos = Object.values(SituacaoViolencia);
            const invalido = dados.situacoesViolencia.some((v) => !valoresValidos.includes(v));
            if (invalido) {
                return { success: false, statusCode: 400, message: "Opção inválida em situação de violência." };
            }
        }

        if (
            dados.acessoTransporte !== undefined &&
            dados.acessoTransporte !== null &&
            !Object.values(AcessoTransporte).includes(dados.acessoTransporte)
        ) {
            return { success: false, statusCode: 400, message: "Opção inválida de acesso a transporte." };
        }

        if (
            dados.identificacaoSituacao !== undefined &&
            dados.identificacaoSituacao !== null &&
            !Object.values(IdentificacaoSituacao).includes(dados.identificacaoSituacao)
        ) {
            return { success: false, statusCode: 400, message: "Opção inválida de identificação de situação." };
        }

        if (
            dados.situacaoFamiliarInstavel !== undefined &&
            dados.situacaoFamiliarInstavel !== null &&
            !Object.values(SituacaoFamiliarInstavel).includes(dados.situacaoFamiliarInstavel)
        ) {
            return { success: false, statusCode: 400, message: "Opção inválida de situação familiar instável." };
        }

        if (
            dados.programaSocial !== undefined &&
            dados.programaSocial !== null &&
            !Object.values(ProgramaSocial).includes(dados.programaSocial)
        ) {
            return { success: false, statusCode: 400, message: "Opção inválida de programa social." };
        }

        // 5. Regras de campos condicionais 'Outro':
        // Se a opção OUTRA/OUTRO foi selecionada, preserva o texto limpo; caso contrário, define null.
        const situacaoSaudeOutra = dados.situacoesSaude?.includes(SituacaoSaude.OUTRA)
            ? dados.situacaoSaudeOutra?.trim() || null
            : null;

        const situacaoViolenciaOutra = dados.situacoesViolencia?.includes(SituacaoViolencia.OUTRA)
            ? dados.situacaoViolenciaOutra?.trim() || null
            : null;

        const programaSocialOutro = dados.programaSocial === ProgramaSocial.OUTRO
            ? dados.programaSocialOutro?.trim() || null
            : null;

        const payloadTratado: SalvarSituacaoVidaDTO = {
            situacoesSaude: dados.situacoesSaude ?? [],
            situacaoSaudeOutra,
            situacoesViolencia: dados.situacoesViolencia ?? [],
            situacaoViolenciaOutra,
            acessoTransporte: dados.acessoTransporte ?? null,
            identificacaoSituacao: dados.identificacaoSituacao ?? null,
            situacaoFamiliarInstavel: dados.situacaoFamiliarInstavel ?? null,
            programaSocial: dados.programaSocial ?? null,
            programaSocialOutro,
        };

        // 6. Salvar (upsert)
        const registro = await SituacaoVidaRepository.upsertSituacaoVida(aluno.id, payloadTratado);

        return {
            success: true,
            statusCode: 200,
            message: "Situações de vida salvas com sucesso.",
            data: registro,
        };
    }

    public static async obterSituacaoVidaSolicitacao(solicitacaoId: number, authId: number) {
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

        const registro = await SituacaoVidaRepository.findByAlunoId(aluno.id);

        return {
            success: true,
            statusCode: 200,
            message: "Situações de vida obtidas com sucesso.",
            data: registro,
        };
    }
}
