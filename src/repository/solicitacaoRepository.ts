import prisma from "../config/database";
import { StatusSolicitacao } from "@prisma/client";

export class SolicitacaoRepository {
  public static async findById(id: number) {
    return prisma.solicitacao.findUnique({
      where: { id },
    });
  }
// Verifica se o aluno já tem um rascunho em aberto para aquele auxílio
  public static async findRascunho(alunoId: number, auxilioId: number) {
    return prisma.solicitacao.findFirst({
      where: {
        alunoId,
        auxilioId,
        status: StatusSolicitacao.RASCUNHO,
      },
    });
  }
  // Cria a solicitação como RASCUNHO
  public static async create(alunoId: number, auxilioId: number) {
    return prisma.solicitacao.create({
      data: {
        alunoId,
        auxilioId,
        status: StatusSolicitacao.RASCUNHO,
      },
    });
  }
}
