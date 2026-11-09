import prisma from "../config/database";
import { StatusSolicitacao } from "@prisma/client";

export class SolicitacaoRepository {
  public static async findById(id: number) {
    return prisma.solicitacao.findUnique({
      where: { id },
    });
  }

  // Busca a solicitação detalhada com aluno, auxílio, funcionário e documentos
  public static async findByIdWithDetails(id: number) {
    return prisma.solicitacao.findUnique({
      where: { id },
      include: {
        aluno: {
          include: {
            enderecos: true,
            situacaoVida: true,
          },
        },
        auxilio: true,
        funcionario: {
          select: {
            id: true,
            nome: true,
            siape: true,
          },
        },
        documentos: {
          include: {
            documento: true,
          },
        },
      },
    });
  }

  // Lista solicitações paginadas com filtros
  public static async findAll(
    page: number = 1,
    limit: number = 10,
    filters?: { status?: StatusSolicitacao; auxilioId?: number; alunoId?: number }
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.auxilioId) {
      where.auxilioId = filters.auxilioId;
    }
    if (filters?.alunoId) {
      where.alunoId = filters.alunoId;
    }

    const [total, solicitacoes] = await Promise.all([
      prisma.solicitacao.count({ where }),
      prisma.solicitacao.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          aluno: {
            select: {
              id: true,
              nome: true,
              matricula: true,
              cpf: true,
              curso: true,
            },
          },
          auxilio: {
            select: {
              id: true,
              nome: true,
              tipoAuxilio: true,
            },
          },
          funcionario: {
            select: {
              id: true,
              nome: true,
              siape: true,
            },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      solicitacoes,
    };
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

  // Atualiza o relato pessoal da solicitação
  public static async updateRelato(id: number, relato: string) {
    return prisma.solicitacao.update({
      where: { id },
      data: { relato },
    });
  }
}

