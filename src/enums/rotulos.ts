import {
  CondicaoMoradia,
  SituacaoOcupacional,
  EstadoCivil,
  EtniaRaca,
} from "@prisma/client";

export const rotulosCondicaoMoradia: Record<CondicaoMoradia, string> = {
  MORA_COM_FAMILIA: "Mora com a família",
  MORA_SOZINHO: "Mora sozinho(a)",
  DIVIDE_ALUGUEL: "Divide aluguel",
  MORA_COM_AMIGOS: "Mora com amigos",
  OUTRO: "Outro",
};

export const rotulosSituacaoOcupacional: Record<SituacaoOcupacional, string> = {
  PROPRIETARIO_SOCIO_EMPRESA: "Proprietário(a) ou sócio(a) de empresa",
  MEI_PROFISSIONAL_LIBERAL: "MEI ou profissional liberal",
  TRABALHADOR_ASSALARIADO: "Trabalhador(a) assalariado(a)",
  APOSENTADO_PENSIONISTA_BPC: "Aposentado(a), pensionista ou beneficiário(a) do BPC",
  TRABALHADOR_INFORMAL_AUTONOMO: "Trabalhador(a) informal ou autônomo(a)",
  RENDA_DE_TERCEIROS: "Renda de terceiros",
  TRABALHADOR_RURAL: "Trabalhador(a) rural",
  BOLSISTA_ESTAGIARIO: "Bolsista ou estagiário(a)",
  DESEMPREGADO_SEGURO_DESEMPREGO: "Desempregado(a) ou em seguro-desemprego",
};

export const rotulosEstadoCivil: Record<EstadoCivil, string> = {
  SOLTEIRO: "Solteiro(a)",
  CASADO: "Casado(a)",
  UNIAO_ESTAVEL: "União Estável",
  SEPARADO: "Separado(a)",
  DIVORCIADO: "Divorciado(a)",
  VIUVO: "Viúvo(a)",
};

export const rotulosEtniaRaca: Record<EtniaRaca, string> = {
  AMARELO: "Amarela",
  BRANCO: "Branca",
  INDIGENA: "Indígena",
  PARDO: "Parda",
  PRETO: "Preta",
  PRETO_QUILOMBOLA: "Preta - quilombola",
  PRETO_NAO_QUILOMBOLA: "Preta - não quilombola",
  NAO_INFORMAR: "Prefiro não informar",
  NAO_DECLARAR: "Não declarar",
};
