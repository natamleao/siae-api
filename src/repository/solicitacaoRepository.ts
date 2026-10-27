import prisma from "../config/database";

export class SolicitacaoRepository {
  public static async findById(id: number) {
    return prisma.solicitacao.findUnique({
      where: { id },
    });
  }
}
