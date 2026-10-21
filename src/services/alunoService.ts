import { RegisterAlunoData } from "../models/alunoModel";
import { UpdateAlunoData } from "../models/alunoModel";
import { AlunoRepository } from "../repository/alunoRepository";
import { AuthRepository } from "../repository/authRepository";
import { generateToken } from "./authService";

import bcrypt from 'bcryptjs';


export class AlunoService {
    public static async registerAluno(data: RegisterAlunoData) {
        const validationData = await AlunoService.validateRegisterData(data)
        if (validationData.success == false) {
            return validationData;
        }

        const dataEmail = await AuthRepository.findAuthByEmail(data.email)
        const dataMatricula = await AlunoRepository.findAlunoByMatricula(data.matricula)

        if (dataEmail !== null) {
            return {
                success: false,
                message: 'Email já existente'
            };
        }

        if (dataMatricula !== null) {
            return {
                success: false,
                message: "Matricula já existente"
            };
        }

        try {
            const senhaHash = await bcrypt.hash(data.senha, 10);

            const createNewAluno = await AuthRepository.createAuthWithAluno({
                ...data,
                senha: senhaHash
            })

            return {
                success: true,
                message: "Aluno registrado com sucesso.",
                data: {
                    id: createNewAluno.aluno.id,
                    nome: createNewAluno.aluno.nome,
                    matricula: createNewAluno.aluno.matricula,
                    email: createNewAluno.auth.email,
                    permissao: createNewAluno.auth.permissao,
                    token: generateToken(createNewAluno.auth)
                }
            }
        } catch (error: any) {
            return { success: false, message: 'Erro ao registrar o aluno: ' + error.message }

        }
    }

    public static async validateRegisterData(data: RegisterAlunoData) {
        const regexNumbVerification: RegExp = /^\d+$/;
        const regexEmailVerification: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (data.nome.trim().length < 1 || data.nome.length > 50) {
            return { success: false, message: 'Nome deve ter entre 1 e 50 caracteres' }
        }

        if (data.senha.length < 6) {
            return { success: false, message: 'Senha deve ter no mínimo 6 caracteres' }
        }

        if (regexNumbVerification.test(data.matricula) == false) {
            return { success: false, message: "Matricula aceita somente números" }
        }

        if (regexEmailVerification.test(data.email) == false) {
            return { success: false, message: "Email inválido" }
        }

        return {
            success: true,
            message: "Dados válidos."
        }

    }

    public static async updateDadosComplementares(alunoId: number, data: UpdateAlunoData) {
        if (data.cpf) {
            const existingCPF = await AlunoRepository.findAlunoByCpf(data.cpf);
            if (existingCPF && existingCPF.id !== alunoId) {
                return {
                    success: false,
                    message: "CPF já existente e utilizado por outro aluno."
                }
            }
        }

        if (data.rg) {
            const existingRG = await AlunoRepository.findAlunoByRg(data.rg);
            if (existingRG && existingRG.id !== alunoId) {
                return {
                    success: false,
                    message: "RG já existente e utilizado por outro aluno."
                }
            }
        }

        try {
            const updateAluno = await AlunoRepository.updateAluno(alunoId, data);
            return {
                success: true,
                message: "Dados atualizados!",
                data: updateAluno
            }

        } catch (error: any) {
            return {
                success: false,
                message: "Erro ao atualizar os dados: " + error.message
            }
        }
    }

    public static async getMeusDados(authId: number) {
        const dadosAluno = await AlunoRepository.findAlunoByAuthId(authId);
        if (!dadosAluno) {
            return {
                success: false,
                message: "Aluno não encontrado."
            }
        }

        return {
            success: true,
            message: "Dados do aluno encontrados.",
            data: dadosAluno
        }
    }

    public static async getAlunoById(alunoId: number) {
        const dadosAluno = await AlunoRepository.findAlunoById(alunoId);
        if (!dadosAluno) {
            return {
                success: false,
                message: "Aluno não encontrado."
            }
        }

        return {
            success: true,
            message: "Dados do aluno encontrados.",
            data: dadosAluno
        }
    }

    public static async getAlunoByEmail(email: string) {
        const dadosAluno = await AlunoRepository.findAlunoByEmail(email);
        if (!dadosAluno) {
            return {
                success: false,
                message: "Aluno não encontrado."
            }
        }

        return {
            success: true,
            message: "Dados do aluno encontrados.",
            data: dadosAluno
        }
    }

    public static async getAlunoByMatricula(matricula: string) {
        const dadosAluno = await AlunoRepository.findAlunoByMatricula(matricula);
        if (!dadosAluno) {
            return {
                success: false,
                message: "Aluno não encontrado."
            }
        }

        return {
            success: true,
            message: "Dados do aluno encontrados.",
            data: dadosAluno
        }

    }

    public static async getAlunoIdByAuthId(authId: number) {
        const aluno = await AlunoRepository.findAlunoByAuthId(authId);
        if (!aluno) {
            return { success: false, message: "Aluno não encontrado." };
        }
        return { success: true, alunoId: aluno.id };
    }

    public static async getAllAlunos(page: number, limit: number) {
        const alunos = await AlunoRepository.findAllAlunos(page, limit);
        return {
            success: true,
            message: "Alunos encontrados.",
            data: alunos
        }
    }

} 