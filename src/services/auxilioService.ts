import { TipoAuxilio } from "@prisma/client";
import { AuxilioRepository } from "../repository/auxilioRepository";
import { CreateAuxilioDTO } from "../models/auxilioModel";

export class AuxilioService {
    public static async listarTodos() {
        const auxilios = await AuxilioRepository.findAll();
        return {
            success: true,
            data: auxilios
        };
    }

    public static async criarAuxilio(dados: CreateAuxilioDTO) {
        if (!dados.nome || dados.nome.trim().length === 0) {
            return { success: false, statusCode: 400, message: "O nome do auxílio é obrigatório." };
        }

        if (!Object.values(TipoAuxilio).includes(dados.tipoAuxilio)) {
            return { success: false, statusCode: 400, message: "Tipo de auxílio inválido (deve ser BOLSA ou AUXILIO)." };
        }

        const auxilio = await AuxilioRepository.create({
            nome: dados.nome.trim(),
            tipoAuxilio: dados.tipoAuxilio,
            descricao: dados.descricao?.trim() || null
        });

        return {
            success: true,
            statusCode: 201,
            message: "Auxílio criado com sucesso.",
            data: auxilio
        };
    }
}
