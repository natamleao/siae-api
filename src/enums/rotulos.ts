import {
  CondicaoMoradia,
  SituacaoOcupacional,
  EstadoCivil,
  EtniaRaca,
  SituacaoSaude,
  SituacaoViolencia,
  AcessoTransporte,
  IdentificacaoSituacao,
  SituacaoFamiliarInstavel,
  ProgramaSocial,
} from "@prisma/client";

export const rotulosCondicaoMoradia: Record<CondicaoMoradia, string> = {
  MORA_COM_FAMILIA: "Mora com a família",
  MORA_SOZINHO: "Mora sozinho(a)",
  DIVIDE_ALUGUEL: "Divide aluguel",
  MORA_COM_AMIGOS: "Mora com amigos",
  OUTRO: "Outro",
};

export const rotulosSituacaoOcupacional: Record<SituacaoOcupacional, string> = {
  PROPRIETARIO_SOCIO_EMPRESA: "Proprietário(a) ou socio(a) de empresa",
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

export const rotulosSituacaoSaude: Record<SituacaoSaude, string> = {
  DOENCA_CRONICA: "Doença crônica (ex: diabetes, asma)",
  DOENCA_GRAVE: "Doença grave (ex: câncer, doenças que exigem tratamento contínuo)",
  DEFICIENCIA: "Deficiência",
  USO_CONTINUO_MEDICAMENTO: "Uso contínuo de medicamentos",
  OUTRA: "Outra",
  NAO: "Não",
};

export const rotulosSituacaoViolencia: Record<SituacaoViolencia, string> = {
  VIOLENCIA_DOMESTICA: "Violência doméstica",
  VIOLENCIA_PSICOLOGICA: "Violência psicológica",
  VIOLENCIA_COMUNIDADE_URBANA: "Violência na comunidade (urbana)",
  OUTRA: "Outra",
  NAO: "Não",
};

export const rotulosAcessoTransporte: Record<AcessoTransporte, string> = {
  NAO_TENHO_ACESSO: "Não tenho acesso a transporte",
  TRANSPORTE_PAGO_COM_DIFICULDADE: "Transporte pago com dificuldade de locomoção",
  TRANSPORTE_PAGO_SEM_DIFICULDADE: "Transporte pago sem dificuldade de locomoção",
  TRANSPORTE_GRATUITO_COM_DIFICULDADE: "Transporte gratuito com dificuldade de locomoção",
  TRANSPORTE_GRATUITO_SEM_DIFICULDADE: "Transporte gratuito sem dificuldade de locomoção",
};

export const rotulosIdentificacaoSituacao: Record<IdentificacaoSituacao, string> = {
  GESTANTE: "Estou gestante",
  TEM_FILHOS: "Tenho filhos",
  NAO: "Não",
};

export const rotulosSituacaoFamiliarInstavel: Record<SituacaoFamiliarInstavel, string> = {
  SIM: "Sim",
  NAO: "Não",
};

export const rotulosProgramaSocial: Record<ProgramaSocial, string> = {
  BOLSA_FAMILIA: "Bolsa Família",
  BPC_LOAS: "BPC/LOAS",
  SEGURO_SAFRA: "Seguro Safra",
  OUTRO: "Outro",
  NAO: "Não",
};
