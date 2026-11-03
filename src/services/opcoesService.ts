import {
  CondicaoMoradia,
  SituacaoOcupacional,
} from "@prisma/client";
import {
  rotulosCondicaoMoradia,
  rotulosSituacaoOcupacional,
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
    };
  }
}
