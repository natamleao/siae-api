import { TipoMoradia, CondicaoMoradia } from "@prisma/client";
import { EnderecoRepository } from "../repository/enderecoRepository";
import { SolicitacaoRepository } from "../repository/solicitacaoRepository";
import { AlunoRepository } from "../repository/alunoRepository";
import { SalvarEnderecoDTO } from "../models/enderecoModel";
import { isUfValida, isTipoMoradiaValida, isCondicaoMoradiaValida } from "../utils/enderecoValidators";

export class EnderecoService {
  public static async salvarEnderecoSolicitacao(
    solicitacaoId: number,
    authId: number,
    dados: SalvarEnderecoDTO
  ) {
    // 1. Descobrir aluno pelo authId
    const aluno = await AlunoRepository.findAlunoByAuthId(authId);
    if (!aluno) {
      return { success: false, statusCode: 404, message: "Aluno não encontrado." };
    }

    // 2. Validar se a solicitação existe e pertence ao aluno logado
    const solicitacao = await SolicitacaoRepository.findById(solicitacaoId);
    if (!solicitacao) {
      return { success: false, statusCode: 404, message: "Solicitação não encontrada." };
    }

    if (solicitacao.alunoId !== aluno.id) {
      return { success: false, statusCode: 403, message: "Você não tem permissão para alterar esta solicitação." };
    }

    // 3. Validar campos obrigatórios de endereço
    if (!dados.logradouro || !dados.numero || !dados.bairro || !dados.municipio || !dados.estado || !dados.origemFamilia) {
      return { success: false, statusCode: 400, message: "Campos obrigatórios de endereço não preenchidos." };
    }

    // 4. Validar UF (Estado)
    if (!dados.estado || dados.estado.length !== 2 || !isUfValida(dados.estado)) {
      return { success: false, statusCode: 400, message: "Estado (UF) inválido." };
    }

    // 5. Validar Enums
    if (!isTipoMoradiaValida(dados.tipoMoradia)) {
      return { success: false, statusCode: 400, message: "Tipo de moradia inválido." };
    }

    if (!isCondicaoMoradiaValida(dados.condicaoMoradia)) {
      return { success: false, statusCode: 400, message: "Condição de moradia inválida." };
    }

    // 6. Regra: campos ...Outro só existem se o respectivo enum for OUTRO
    const tipoMoradiaOutro =
      dados.tipoMoradia === TipoMoradia.OUTRO
        ? dados.tipoMoradiaOutro?.trim() || null
        : null;

    if (dados.tipoMoradia === TipoMoradia.OUTRO && !tipoMoradiaOutro) {
      return { success: false, statusCode: 400, message: "Descreva o tipo de moradia no campo outro." };
    }

    const condicaoMoradiaOutro =
      dados.condicaoMoradia === CondicaoMoradia.OUTRO
        ? dados.condicaoMoradiaOutro?.trim() || null
        : null;

    if (dados.condicaoMoradia === CondicaoMoradia.OUTRO && !condicaoMoradiaOutro) {
      return { success: false, statusCode: 400, message: "Descreva a condição de moradia no campo outro." };
    }

    const payloadTratado: SalvarEnderecoDTO = {
      ...dados,
      estado: dados.estado.toUpperCase(),
      tipoMoradiaOutro,
      condicaoMoradiaOutro,
      complemento: dados.complemento?.trim() || null,
      // cep: dados.cep?.trim() || null, //deixar comentado para casos futuros
      origemFamilia: dados.origemFamilia.trim(),
    };

    // 7. Upsert no banco
    const enderecoSalvo = await EnderecoRepository.upsertEndereco(aluno.id, payloadTratado);

    return {
      success: true,
      statusCode: 200,
      message: "Endereço salvo com sucesso.",
      data: enderecoSalvo,
    };
  }
}
