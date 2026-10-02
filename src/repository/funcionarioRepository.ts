import prisma from "../config/database";
import { Funcionario } from "@prisma/client";

export class FuncionarioRepository {
    public static async findFuncionarioByAuthId(authId: number) {
        return prisma.funcionario.findUnique({
            where: { authId },
            include: { auth: true }
        });
    }

    public static async findFuncionarioBySiape(
        siape: number,
    ): Promise<Funcionario | null> {
        return prisma.funcionario.findUnique({ where: { siape } })
    }
}