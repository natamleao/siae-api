import prisma from "../config/database";
import { Auth } from "@prisma/client";
import { Permissao } from "../enums/permissions";

export class AuthRepository {
    public static async findAuthByEmail(
        email: string,
    ): Promise<Auth | null> {
        return prisma.auth.findUnique({ where: { email } });
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

    public static async createFuncionarioWithAuth(data: {
        email: string;
        senha: string;
        permissao: Permissao.TECNICO | Permissao.ASSISTENTE;
        nome: string;
        siape: number;
    }) {
        return await prisma.$transaction(async (tx) => {

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


}