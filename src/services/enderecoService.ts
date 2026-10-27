import { SituacaoMoradia, CondicaoMoradia } from "@prisma/client";
import { EnderecoRepository } from "../repository/enderecoRepository";
import { SolicitacaoRepository } from "../repository/solicitacaoRepository";
import { SalvarEnderecoDTO } from "../models/enderecoModel";
import { isUfValida, isSituacaoMoradiaValida, isCondicaoMoradiaValida } from "../utils/enderecoValidators";

export class EnderecoService {
  public static async salvarEnderecoSolicitacao(
    solicitacaoId: number,
    alunoId: number,
    dados: SalvarEnderecoDTO
  ) {
    // 1. Validar se a solicitação existe e pertence ao aluno logado
    const solicitacao = await SolicitacaoRepository.findById(solicitacaoId);
    if (!solicitacao) {
      return { success: false, statusCode: 404, message: "Solicitação não encontrada." };
    }

    if (solicitacao.alunoId !== alunoId) {
      return { success: false, statusCode: 403, message: "Você não tem permissão para alterar esta solicitação." };
    }

    // 2. Validar campos obrigatórios de endereço
    if (!dados.logradouro || !dados.numero || !dados.bairro || !dados.municipio || !dados.estado) {
      return { success: false, statusCode: 400, message: "Campos obrigatórios de endereço não preenchidos." };
    }

    // 3. Validar UF (Estado)
    if (!dados.estado || dados.estado.length !== 2 || !isUfValida(dados.estado)) {
      return { success: false, statusCode: 400, message: "Estado (UF) inválido." };
    }

    // 4. Validar Enums
    if (!isSituacaoMoradiaValida(dados.situacaoMoradia)) {
      return { success: false, statusCode: 400, message: "Situação de moradia inválida." };
    }

    if (!isCondicaoMoradiaValida(dados.condicaoMoradia)) {
      return { success: false, statusCode: 400, message: "Condição de moradia inválida." };
    }

    // 5. Regra: campos ...Outro só existem se o enum for OUTRO
    const situacaoMoradiaOutro =
      dados.situacaoMoradia === SituacaoMoradia.OUTRO
        ? dados.situacaoMoradiaOutro?.trim() || null
        : null;

    if (dados.situacaoMoradia === SituacaoMoradia.OUTRO && !situacaoMoradiaOutro) {
      return { success: false, statusCode: 400, message: "Descreva a situação de moradia no campo outro." };
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
      situacaoMoradiaOutro,
      condicaoMoradiaOutro,
      complemento: dados.complemento?.trim() || null,
      cep: dados.cep?.trim() || null,
    };

    // 6. Upsert no banco
    const enderecoSalvo = await EnderecoRepository.upsertEndereco(alunoId, payloadTratado);

    return {
      success: true,
      statusCode: 200,
      message: "Endereço salvo com sucesso.",
      data: enderecoSalvo,
    };
  }
}
