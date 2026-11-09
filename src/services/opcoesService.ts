import {
  CondicaoMoradia,
  SituacaoOcupacional,
  SituacaoSaude,
  SituacaoViolencia,
  AcessoTransporte,
  IdentificacaoSituacao,
  SituacaoFamiliarInstavel,
  ProgramaSocial,
} from "@prisma/client";
import {
  rotulosCondicaoMoradia,
  rotulosSituacaoOcupacional,
  rotulosSituacaoSaude,
  rotulosSituacaoViolencia,
  rotulosAcessoTransporte,
  rotulosIdentificacaoSituacao,
  rotulosSituacaoFamiliarInstavel,
  rotulosProgramaSocial,
} from "../enums/rotulos";
import { Opcao, OpcoesFormularioResponse } from "../models/opcao";

function enumParaOpcoes<T extends string>(
  enumObj: Record<string, T>,
  rotulos: Record<T, string>
): Opcao[] {
  return Object.values(enumObj).map((valor) => ({
    valor,
    rotulo: rotulos[valor],
  }));
}

export class OpcoesService {
  static obterOpcoesFormulario(): OpcoesFormularioResponse {
    return {
      condicoesMoradia: enumParaOpcoes(CondicaoMoradia, rotulosCondicaoMoradia),
      situacoesOcupacionais: enumParaOpcoes(
        SituacaoOcupacional,
        rotulosSituacaoOcupacional
      ),
      situacoesSaude: enumParaOpcoes(SituacaoSaude, rotulosSituacaoSaude),
      situacoesViolencia: enumParaOpcoes(SituacaoViolencia, rotulosSituacaoViolencia),
      acessosTransporte: enumParaOpcoes(AcessoTransporte, rotulosAcessoTransporte),
      identificacoesSituacao: enumParaOpcoes(IdentificacaoSituacao, rotulosIdentificacaoSituacao),
      situacoesFamiliaresInstaveis: enumParaOpcoes(
        SituacaoFamiliarInstavel,
        rotulosSituacaoFamiliarInstavel
      ),
      programasSociais: enumParaOpcoes(ProgramaSocial, rotulosProgramaSocial),
    };
  }
}
