import bcrypt from 'bcryptjs';
import { AuthRepository } from "../repository/authRepository";
import { FuncionarioRepository } from "../repository/funcionarioRepository";
import { RegisterFuncionarioData } from "../models/FuncionarioModel";
import { Permissao } from '../enums/permissions';
import { validatePassword } from '../utils/passwordValidator';
import { Prisma } from "@prisma/client";
import { logError } from "../utils/logger.js";

export class FuncionarioService {
    public static async registerFuncionario(
        data: RegisterFuncionarioData,
        adminId: number
    ) {
        if (
            data.permissao !== Permissao.TECNICO &&
            data.permissao !== Permissao.ASSISTENTE
        ) {
            return {
                success: false,
                code: "INVALID_PERMISSION",
                message: "Permissão inválida para cadastro de funcionário"
            };
        }

        if (!validatePassword(data.senha)) {
            return {
                success: false,
                code: "INVALID_PASSWORD",
                message: "Senha deve ter de 8 a 16 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial permitido (! @ # $ % & * - _)"
            };
        }

        const admin = await AuthRepository.findAuthById(adminId);

        if (
            !admin ||
            (admin.permissao !== Permissao.ADMIN &&
                admin.permissao !== Permissao.ALUNO_ADMIN)
        ) {
            return {
                success: false,
                code: "FORBIDDEN",
                message: "Apenas ADMIN pode cadastrar funcionários"
            };
        }

        const dataEmail = await AuthRepository.findAuthByEmail(data.email);

        if (dataEmail !== null) {
            return {
                success: false,
                code: "EMAIL_EXISTS",
                message: "Email já existe"
            };
        }

        const dataSiape = await FuncionarioRepository.findFuncionarioBySiape(data.siape);

        if (dataSiape !== null) {
            return {
                success: false,
                code: "SIAPE_EXISTS",
                message: "SIAPE já existe"
            };
        }

        try {
            const senhaHash = await bcrypt.hash(data.senha, 10);

            const createFuncionario = await AuthRepository.createFuncionarioWithAuth({
                email: data.email,
                senha: senhaHash,
                permissao: data.permissao,
                nome: data.nome,
                siape: data.siape,
            });

            return {
                success: true,
                message: "Funcionário cadastrado com sucesso",
                data: {
                    id: createFuncionario.funcionario.id,
                    nome: createFuncionario.funcionario.nome,
                    siape: createFuncionario.funcionario.siape,
                    email: createFuncionario.auth.email,
                    permissao: createFuncionario.auth.permissao,
                }
            };
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                const target = Array.isArray(error.meta?.target)
                    ? error.meta.target.join(",")
                    : String(error.meta?.target ?? "");

                if (target.includes("email")) {
                    return {
                        success: false,
                        code: "EMAIL_EXISTS",
                        message: "Email já existe"
                    };
                }

                if (target.includes("siape")) {
                    return {
                        success: false,
                        code: "SIAPE_EXISTS",
                        message: "SIAPE já existe"
                    };
                }
            }

            logError("Falha ao cadastrar funcionário", error);

            return {
                success: false,
                code: "INTERNAL_ERROR",
                message: "Erro interno ao cadastrar funcionário"
            };
        }
    }

    public static async buscarMeuPerfil(authId: number) {
        const buscarPerfil = await FuncionarioRepository.findFuncionarioByAuthId(authId);
        if (!buscarPerfil) {
            return { success: false, message: 'funcionario não encontrado' }
        }
        return {
            success: true,
            message: "funcionario encontrado",
            dataFuncionario: {
                id: buscarPerfil.id,
                nome: buscarPerfil.nome,
                siape: buscarPerfil.siape,
                email: buscarPerfil.auth.email,
                permissao: buscarPerfil.auth.permissao,
            }
        }
    }
}       