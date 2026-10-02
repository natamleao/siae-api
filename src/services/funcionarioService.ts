import bcrypt from 'bcryptjs';
import { AuthRepository } from "../repository/authRepository";
import { FuncionarioRepository } from "../repository/funcionarioRepository";
import { RegisterFuncionarioData } from "../models/FuncionarioModel";
import { Permissao } from '../enums/permissions';

export class FuncionarioService {
    public static async registerFuncionario(
        data: RegisterFuncionarioData,
        adminId: number
    ) {
        const admin = await AuthRepository.findAuthById(adminId);
        if (!admin || admin.permissao !== Permissao.ADMIN) {
            return { success: false, message: 'Apenas ADMIN pode cadastrar funcionários' };
        }

        const dataEmail = await AuthRepository.findAuthByEmail(data.email);
        if (dataEmail !== null) {
            return { success: false, message: 'email já existe' }
        }

        const dataSiape = await FuncionarioRepository.findFuncionarioBySiape(data.siape);
        if (dataSiape !== null) {
            return { success: false, message: 'siape já existe' }
        }
        try {
            const senhaHash = await bcrypt.hash(data.senha, 10);

            const createFuncionario = await AuthRepository.createFuncionarioWithAuth({
                email: data.email,
                senha: senhaHash,
                permissao: data.permissao,
                nome: data.nome,
                siape: data.siape,
            })
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

            }
        } catch (error: any) {
            return { success: false, message: 'Erro ao cadastrar funcionário: ' + error.message }
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