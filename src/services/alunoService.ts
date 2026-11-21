import { IdentificacaoPessoalData, RegisterAlunoData, DadosAcademicosData } from "../models/alunoModel";
import { AlunoRepository } from "../repository/alunoRepository";
import { AuthRepository } from "../repository/authRepository";
import { generateToken } from "./authService";
import {
    validateCPF,
    validateName,
    validateRg,
    converterData,
    isDataNascValida,
    validatePhone,
    validateEmailInstitucional,
    validateTurno
} from "../utils/validators";
import { sanitizeCpf, sanitizeRg, sanitizePhone } from "../utils/sanitize";
import { validatePassword } from "../utils/passwordValidator";
import { logError } from "../utils/logger.js";

import { TipoResponsavel, Sexo, IdentidadeGenero, OrientacaoSexual, EtniaRaca, EstadoCivil, TipoDeficiencia, Prisma } from "@prisma/client";

import bcrypt from 'bcryptjs';


export class AlunoService {
    public static async registerAluno(data: RegisterAlunoData) {
        if (
            !data ||
            typeof data.nome !== "string" ||
            typeof data.matricula !== "string" ||
            typeof data.email !== "string" ||
            typeof data.senha !== "string"
        ) {
            return {
                success: false,
                code: "INVALID_DATA",
                message: "Nome, matrícula, email e senha devem ser informados em formato válido."
            };
        }

        const dadosNormalizados: RegisterAlunoData = {
            ...data,
            nome: data.nome.trim().replace(/\s+/g, " "),
            matricula: data.matricula.trim(),
            email: data.email.trim().toLowerCase()
        };

        const validationData = await AlunoService.validateRegisterData(dadosNormalizados);

        if (!validationData.success) {
            return {
                ...validationData,
                code: "INVALID_DATA"
            };
        }

        const dataEmail = await AuthRepository.findAuthByEmail(dadosNormalizados.email);

        if (dataEmail !== null) {
            return {
                success: false,
                code: "EMAIL_EXISTS",
                message: "Email já existente"
            };
        }

        const dataMatricula = await AlunoRepository.findAlunoByMatricula(dadosNormalizados.matricula);

        if (dataMatricula !== null) {
            return {
                success: false,
                code: "MATRICULA_EXISTS",
                message: "Matrícula já existente"
            };
        }

        try {
            const senhaHash = await bcrypt.hash(dadosNormalizados.senha, 10);

            const createNewAluno = await AuthRepository.createAuthWithAluno({
                ...dadosNormalizados,
                senha: senhaHash
            });

            return {
                success: true,
                message: "Aluno registrado com sucesso.",
                data: {
                    id: createNewAluno.aluno.id,
                    authId: createNewAluno.auth.id,
                    nome: createNewAluno.aluno.nome,
                    matricula: createNewAluno.aluno.matricula,
                    email: createNewAluno.auth.email,
                    permissao: createNewAluno.auth.permissao,
                    token: generateToken(createNewAluno.auth)
                }
            };
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                const target = Array.isArray(error.meta?.target)
                    ? error.meta.target.join(",").toLowerCase()
                    : String(error.meta?.target ?? "").toLowerCase();

                if (target.includes("email")) {
                    return {
                        success: false,
                        code: "EMAIL_EXISTS",
                        message: "Email já existente"
                    };
                }

                if (target.includes("matricula")) {
                    return {
                        success: false,
                        code: "MATRICULA_EXISTS",
                        message: "Matrícula já existente"
                    };
                }
            }

            logError("Falha ao cadastrar aluno", error);

            return {
                success: false,
                code: "INTERNAL_ERROR",
                message: "Erro interno ao cadastrar aluno"
            };
        }
    }

    public static async validateRegisterData(data: RegisterAlunoData) {
        const nome = data.nome.trim();
        const palavrasNome = nome.split(/\s+/).filter(Boolean);
        const regexMatricula = /^\d{6}$/;
        const regexEmailInstitucional = /^[^\s@]+@alu\.ufc\.br$/i;

        if (nome.length < 1 || nome.length > 50 || !validateName(nome) || palavrasNome.length < 2) {
            return { success: false, message: 'Informe seu nome completo, com pelo menos nome e sobrenome' };
        }

        if (!regexMatricula.test(data.matricula)) {
            return { success: false, message: 'Matrícula deve conter exatamente 6 dígitos' };
        }

        if (!regexEmailInstitucional.test(data.email.trim())) {
            return { success: false, message: 'Informe um e-mail institucional @alu.ufc.br válido' };
        }

        if (!validatePassword(data.senha)) {
            return {
                success: false,
                message: 'Senha deve ter de 8 a 16 caracteres, com letra maiúscula, minúscula, número e caractere especial permitido'
            };
        }

        return {
            success: true,
            message: "Dados válidos."
        };
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

    public static validateIdentificacaoPessoal(data: IdentificacaoPessoalData) {

        //Validação de campos ENUM
        if (data.sexo !== undefined && !Object.values(Sexo).includes(data.sexo)) {
            return { success: false, message: "Sexo inválido." };
        }

        if (data.tipoResponsavel !== undefined && !Object.values(TipoResponsavel).includes(data.tipoResponsavel)) {
            return { success: false, message: "Tipo de responsável inválido." };
        }

        if (data.identidadeGenero !== undefined && !Object.values(IdentidadeGenero).includes(data.identidadeGenero)) {
            return { success: false, message: "Identidade de gênero inválida." };
        }

        if (data.orientacaoSexual !== undefined && !Object.values(OrientacaoSexual).includes(data.orientacaoSexual)) {
            return { success: false, message: "Orientação sexual inválida." };
        }

        if (data.etniaRaca !== undefined && !Object.values(EtniaRaca).includes(data.etniaRaca)) {
            return { success: false, message: "Etnia/raça inválida." };
        }

        if (data.estadoCivil !== undefined && !Object.values(EstadoCivil).includes(data.estadoCivil)) {
            return { success: false, message: "Estado civil inválido." };
        }

        if (data.tipoDeficiencia !== undefined && !Object.values(TipoDeficiencia).includes(data.tipoDeficiencia)) {
            return { success: false, message: "Tipo de deficiência inválido." };
        }

        if (
            data.nomeResponsavel !== undefined && !validateName(data.nomeResponsavel)
        ) {
            return { success: false, message: "O nome do responsável deve conter apenas letras e espaços." };
        }


        // Validação de campos OUTRO
        if (
            data.tipoResponsavel === TipoResponsavel.OUTRO &&
            (!data.tipoResponsavelOutro || !validateName(data.tipoResponsavelOutro))
        ) {
            return {
                success: false,
                message: "Quando o responsável for 'Outro', informe o texto usando apenas letras e espaços."
            };
        }

        if (data.identidadeGenero === IdentidadeGenero.OUTRO &&
            (!data.identidadeGeneroOutro || !validateName(data.identidadeGeneroOutro))) {
            return {
                success: false,
                message: "Campo da identidade de gênero é obrigatório, não é permitido usar números ou caracteres especiais."
            };
        }

        if (data.orientacaoSexual === OrientacaoSexual.OUTRO &&
            (!data.orientacaoSexualOutro || !validateName(data.orientacaoSexualOutro))) {
            return {
                success: false,
                message: "Campo da orientação sexual é obrigatório, não é permitido usar números ou caracteres especiais."
            };
        }

        if (data.tipoDeficiencia === TipoDeficiencia.OUTRA &&
            (!data.tipoDeficienciaOutro || !validateName(data.tipoDeficienciaOutro))) {
            return {
                success: false,
                message: "Campo do tipo de deficiência é obrigatório, não é permitido usar números ou caracteres especiais."
            };
        }

        return { success: true };
    }

    private static limpezaCamposOutros(data: IdentificacaoPessoalData): IdentificacaoPessoalData {
        const camposLimpos = {
            ...data
        };

        if (data.identidadeGenero !== undefined && data.identidadeGenero !== IdentidadeGenero.OUTRO) {
            camposLimpos.identidadeGeneroOutro = null;
        }

        if (data.orientacaoSexual !== undefined && data.orientacaoSexual !== OrientacaoSexual.OUTRO) {
            camposLimpos.orientacaoSexualOutro = null;
        }

        if (data.tipoDeficiencia !== undefined && data.tipoDeficiencia !== TipoDeficiencia.OUTRA) {
            camposLimpos.tipoDeficienciaOutro = null;
        }

        if (data.tipoResponsavel !== undefined && data.tipoResponsavel !== TipoResponsavel.OUTRO) {
            camposLimpos.tipoResponsavelOutro = null;
        }

        return camposLimpos;
    }


    public static async salvarIdentificacaoPessoal(alunoAuthId: number, data: IdentificacaoPessoalData) {
        const validationResult = AlunoService.validateIdentificacaoPessoal(data);
        if (!validationResult.success) {
            return validationResult;
        }

        const alunoAuth = await AlunoRepository.findAlunoByAuthId(alunoAuthId);
        if (!alunoAuth) {
            return { success: false, message: "Aluno não encontrado." };
        }

        const cloneData = {
            ...data,
        }

        if (data.cpf !== undefined) {
            const cpfSanitizado = sanitizeCpf(data.cpf);
            if (!validateCPF(cpfSanitizado)) {
                return { success: false, message: "CPF inválido." };
            }

            const existingCPF = await AlunoRepository.findAlunoByCpf(cpfSanitizado);
            if (existingCPF && existingCPF.id !== alunoAuth.id) {
                return {
                    success: false,
                    message: "CPF já existente e utilizado por outro aluno."
                }
            }

            cloneData.cpf = cpfSanitizado;
        }

        if (data.rg !== undefined) {
            const rgSanitizado = sanitizeRg(data.rg);
            if (!validateRg(rgSanitizado)) {
                return { success: false, message: "RG inválido." };
            }

            const existingRG = await AlunoRepository.findAlunoByRg(rgSanitizado);
            if (existingRG && existingRG.id !== alunoAuth.id) {
                return {
                    success: false,
                    message: "RG já existente e utilizado por outro aluno."
                }
            }

            cloneData.rg = rgSanitizado;
        }

        if (data.nome !== undefined && !validateName(data.nome)) {
            return {
                success: false, message: "O nome deve conter apenas letras e espaços."
            }
        }

        if (data.dataNasc !== undefined) {
            const convertData = converterData(data.dataNasc)

            if (!isDataNascValida(convertData)) {
                return {
                    success: false,
                    message: "Data de nascimento inválida."
                }
            }

            cloneData.dataNasc = convertData.toISOString();
        }

        if (data.telefone !== undefined) {
            const telefoneSanitizado = sanitizePhone(data.telefone);
            if (!validatePhone(telefoneSanitizado)) {
                return {
                    success: false,
                    message: "Telefone inválido."
                }
            }
            cloneData.telefone = telefoneSanitizado;
        }

        if (data.emailContato !== undefined) {
            if (data.emailContato && !validateEmailInstitucional(data.emailContato)) {
                return {
                    success: false,
                    message: "E-mail institucional inválido. Deve conter @ e domínio .ufc.br"
                };
            }
            cloneData.emailContato = data.emailContato ? data.emailContato.trim().toLowerCase() : null;
        }

        const etapaAtual = alunoAuth.etapaCadastro ?? 0;
        const etapaNova = etapaAtual > 1 ? etapaAtual : 1;

        const dadosLimpos = AlunoService.limpezaCamposOutros(cloneData);
        try {
            const updateAluno = await AlunoRepository.updateAluno(alunoAuth.id, {
                ...dadosLimpos,
                etapaCadastro: etapaNova
            });

            return {
                success: true,
                message: "Identificação pessoal salva com sucesso.",
                data: updateAluno
            }
        } catch (error) {
            logError("Falha ao atualizar aluno", error);
            return {
                success: false,
                message: "Erro ao atualizar aluno."
            };
        }
    }

    public static async salvarDadosAcademicos(alunoId: number, data: DadosAcademicosData) {
        const alunoAuthId = await AlunoRepository.findAlunoByAuthId(alunoId);
        if (!alunoAuthId) {
            return { success: false, message: "Aluno não encontrado." };
        }

        const dadosAtualizar: any = {};

        if (data.curso !== undefined) {
            dadosAtualizar.curso = data.curso ? data.curso.trim() : null;
        }

        if (data.turno !== undefined) {
            if (data.turno) {
                if (!validateTurno(data.turno)) {
                    return {
                        success: false,
                        message: "Turno inválido. Escolha entre: Matutino, Vespertino, Noturno ou Integral."
                    };
                }
                dadosAtualizar.turno = data.turno.trim().toUpperCase();
            } else {
                dadosAtualizar.turno = null;
            }
        }

        if (data.tipoIngresso !== undefined) {
            dadosAtualizar.tipoIngresso = data.tipoIngresso ? data.tipoIngresso.trim() : null;
        }

        if (data.anoIngresso !== undefined) {
            if (data.anoIngresso !== null && (isNaN(Number(data.anoIngresso)) || Number(data.anoIngresso) < 1900)) {
                return { success: false, message: "Ano de ingresso inválido." };
            }
            dadosAtualizar.anoIngresso = data.anoIngresso !== null ? Number(data.anoIngresso) : null;
        }

        if (data.semestreAtual !== undefined) {
            if (data.semestreAtual !== null && (isNaN(Number(data.semestreAtual)) || Number(data.semestreAtual) < 1 || Number(data.semestreAtual) > 20)) {
                return { success: false, message: "Semestre atual inválido." };
            }
            dadosAtualizar.semestreAtual = data.semestreAtual !== null ? Number(data.semestreAtual) : null;
        }

        if (data.recebeuAuxilioGraduacao !== undefined) {
            let recebeuAuxilio: boolean | null = null;
            if (typeof data.recebeuAuxilioGraduacao === "boolean") {
                recebeuAuxilio = data.recebeuAuxilioGraduacao;
            } else if (typeof data.recebeuAuxilioGraduacao === "string") {
                const lower = data.recebeuAuxilioGraduacao.trim().toLowerCase();
                if (lower === "sim" || lower === "true") {
                    recebeuAuxilio = true;
                } else if (lower === "nao" || lower === "não" || lower === "false") {
                    recebeuAuxilio = false;
                }
            }

            dadosAtualizar.recebeuAuxilioGraduacao = recebeuAuxilio;

            if (recebeuAuxilio === true) {
                if (data.auxilioGraduacaoDescricao !== undefined) {
                    dadosAtualizar.auxilioGraduacaoDescricao = data.auxilioGraduacaoDescricao ? data.auxilioGraduacaoDescricao.trim() : null;
                }
            } else if (recebeuAuxilio === false) {
                dadosAtualizar.auxilioGraduacaoDescricao = null;
            }
        } else if (data.auxilioGraduacaoDescricao !== undefined) {
            dadosAtualizar.auxilioGraduacaoDescricao = data.auxilioGraduacaoDescricao ? data.auxilioGraduacaoDescricao.trim() : null;
        }

        const etapaAtual = alunoAuthId.etapaCadastro ?? 0;
        const etapaNova = etapaAtual > 3 ? etapaAtual : 3;

        try {
            const updateAluno = await AlunoRepository.updateAluno(alunoAuthId.id, {
                ...dadosAtualizar,
                etapaCadastro: etapaNova
            });

            return {
                success: true,
                message: "Dados acadêmicos salvos com sucesso.",
                data: updateAluno
            };
        } catch (error: any) {
            return {
                success: false,
                message: "Erro ao atualizar dados acadêmicos: " + error.message
            };
        }
    }
}
