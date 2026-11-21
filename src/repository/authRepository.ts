import prisma from "../config/database";
import { Auth } from "@prisma/client";
import { Permissao } from "../enums/permissions";
import { RegisterAlunoData } from "../models/alunoModel";
import { RegisterFuncionarioData } from "../models/FuncionarioModel";

export class AuthRepository {
    public static async createAuth(data: { email: string; senha: string; permissao: Permissao }): Promise<Auth> {
        return prisma.auth.create({
            data: {
                email: data.email,
                senha: data.senha,
                permissao: data.permissao,
            }
        });
    }

    public static async findAuthByEmail(
        email: string,
    ): Promise<Auth | null> {
        return prisma.auth.findUnique({ where: { email } });
    }

    public static async findAuthByIdentifier(
        identifier: string,
    ): Promise<Auth | null> {
        const siape = /^\d+$/.test(identifier) ? Number(identifier) : null;

        return prisma.auth.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { aluno: { is: { matricula: identifier } } },
                    ...(siape !== null && Number.isSafeInteger(siape)
                        ? [{ funcionario: { is: { siape } } }]
                        : []),
                ],
            },
        });
    }

    public static async findAuthById(id: number): Promise<Auth | null> {
        return prisma.auth.findUnique({ where: { id } });
    }

    public static async updatePassword(
        id: number,
        newPassword: string,
    ): Promise<Auth> {
        return prisma.auth.update({
            where: { id },
            data: { senha: newPassword },
        });
    }

    public static async updateResetToken(
        id: number,
        resetToken: string | null,
        resetTokenExpiry: Date | null,
    ): Promise<Auth> {
        return prisma.auth.update({
            where: { id },
            data: { resetToken, resetTokenExpiry },
        });
    }

    public static async findAuthByResetToken(
        token: string,
    ): Promise<Auth | null> {
        return prisma.auth.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });
    }

    public static async updatePasswordAndClearToken(
        userId: number,
        newHash: string,
    ) {
        return prisma.auth.update({
            where: { id: userId },
            data: {
                senha: newHash,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
    }

    public static async createFuncionarioWithAuth(data: RegisterFuncionarioData) {
        return await prisma.$transaction(async (tx: any) => {
            const auth = await tx.auth.create({
                data: {
                    email: data.email,
                    senha: data.senha,
                    permissao: data.permissao,
                }
            });
            const funcionario = await tx.funcionario.create({
                data: {
                    nome: data.nome,
                    siape: data.siape,
                    authId: auth.id
                }
            });
            return { auth, funcionario };
        });
    }

    public static async createAuthWithAluno(data: RegisterAlunoData) {
        return await prisma.$transaction(async (tx: any) => {
            const auth = await tx.auth.create({
                data: {
                    email: data.email,
                    senha: data.senha,
                    permissao: Permissao.ALUNO
                }
            })

            const aluno = await tx.aluno.create({
                data: {
                    authId: auth.id,
                    nome: data.nome,
                    matricula: data.matricula
                }
            })
            return { auth, aluno };
        })
    }
}
