import prisma from "../config/database";
import { SalvarSituacaoVidaDTO } from "../models/situacaoVidaModel";

export class SituacaoVidaRepository {
  public static async upsertSituacaoVida(alunoId: number, data: SalvarSituacaoVidaDTO) {
    return prisma.situacaoVida.upsert({
      where: { alunoId },
      update: {
        situacoesSaude: data.situacoesSaude ?? [],
        situacaoSaudeOutra: data.situacaoSaudeOutra,
        situacoesViolencia: data.situacoesViolencia ?? [],
        situacaoViolenciaOutra: data.situacaoViolenciaOutra,
        acessoTransporte: data.acessoTransporte,
        identificacaoSituacao: data.identificacaoSituacao,
        situacaoFamiliarInstavel: data.situacaoFamiliarInstavel,
        programaSocial: data.programaSocial,
        programaSocialOutro: data.programaSocialOutro,
      },
      create: {
        alunoId,
        situacoesSaude: data.situacoesSaude ?? [],
        situacaoSaudeOutra: data.situacaoSaudeOutra,
        situacoesViolencia: data.situacoesViolencia ?? [],
        situacaoViolenciaOutra: data.situacaoViolenciaOutra,
        acessoTransporte: data.acessoTransporte,
        identificacaoSituacao: data.identificacaoSituacao,
        situacaoFamiliarInstavel: data.situacaoFamiliarInstavel,
        programaSocial: data.programaSocial,
        programaSocialOutro: data.programaSocialOutro,
      },
    });
  }

  public static async findByAlunoId(alunoId: number) {
    return prisma.situacaoVida.findUnique({
      where: { alunoId },
    });
  }
}

