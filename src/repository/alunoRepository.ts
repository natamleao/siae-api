import prisma from "../config/database";
import { UpdateAlunoData } from "../models/alunoModel";

export class AlunoRepository {
    public static async findAlunoById(id: number) {
        return prisma.aluno.findUnique({
            where: { id },
            include: { auth: true }
        });
    }

    public static async findAlunoByMatricula(matricula: string) {
        return prisma.aluno.findUnique({
            where: { matricula }
        });
    }

    public static async findAlunoByAuthId(authId: number) {
        return prisma.aluno.findUnique({
            where: { authId }
        });
    }

    public static async updateAluno(id: number, toUpdate: UpdateAlunoData) {
        return prisma.aluno.update({
            where: { id },
            data: toUpdate
        });
    }

    public static async findAllAlunos(page: number, limit: number) {
        return prisma.aluno.findMany({
            skip: (page - 1) * limit,
            take: limit
        })
    }

    public static async findAlunoByRg(rg: string) {
        return prisma.aluno.findUnique({
            where: { rg }
        });
    }

    public static async findAlunoByCpf(cpf: string) {
        return prisma.aluno.findUnique({
            where: { cpf }
        });
    }

    public static async findAlunoByEmail(email: string) {
        return prisma.aluno.findFirst({
            where: {
                auth: {
                    email: email
                }
            },
            include: { auth: true }
        })
    }

}