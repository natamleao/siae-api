import prisma from "../config/database";
import { SalvarEnderecoDTO } from "../models/enderecoModel";

export class EnderecoRepository {
  public static async upsertEndereco(alunoId: number, data: SalvarEnderecoDTO) {
    return prisma.endereco.upsert({
      where: { alunoId },
      update: {
        situacaoMoradia: data.situacaoMoradia,
        situacaoMoradiaOutro: data.situacaoMoradiaOutro,
        condicaoMoradia: data.condicaoMoradia,
        condicaoMoradiaOutro: data.condicaoMoradiaOutro,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        estado: data.estado,
        cep: data.cep,
        origemFamilia: data.origemFamilia,
      },
      create: {
        alunoId,
        situacaoMoradia: data.situacaoMoradia,
        situacaoMoradiaOutro: data.situacaoMoradiaOutro,
        condicaoMoradia: data.condicaoMoradia,
        condicaoMoradiaOutro: data.condicaoMoradiaOutro,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento,
        bairro: data.bairro,
        municipio: data.municipio,
        estado: data.estado,
        cep: data.cep,
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
