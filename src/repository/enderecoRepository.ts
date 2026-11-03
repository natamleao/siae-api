import prisma from "../config/database";
import { SalvarEnderecoDTO } from "../models/enderecoModel";

export class EnderecoRepository {
  public static async upsertEndereco(alunoId: number, data: SalvarEnderecoDTO) {
    return prisma.endereco.upsert({
      where: { alunoId },
      update: {
        tipoMoradia: data.tipoMoradia,
        tipoMoradiaOutro: data.tipoMoradiaOutro,
        condicaoMoradia: data.condicaoMoradia,
        condicaoMoradiaOutro: data.condicaoMoradiaOutro,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        estado: data.estado,
        // cep: data.cep, //deixar comentado para casos futuros
        origemFamilia: data.origemFamilia,
      },
      create: {
        alunoId,
        tipoMoradia: data.tipoMoradia,
        tipoMoradiaOutro: data.tipoMoradiaOutro,
        condicaoMoradia: data.condicaoMoradia,
        condicaoMoradiaOutro: data.condicaoMoradiaOutro,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        estado: data.estado,
        // cep: data.cep, //deixar comentado para casos futuros
        origemFamilia: data.origemFamilia,
      },
    });
  }

  public static async findEnderecoByAlunoId(alunoId: number) {
    return prisma.endereco.findUnique({
      where: { alunoId },
    });
  }
}
