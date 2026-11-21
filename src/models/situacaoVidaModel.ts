import {
  SituacaoSaude,
  SituacaoViolencia,
  AcessoTransporte,
  IdentificacaoSituacao,
  SituacaoFamiliarInstavel,
  ProgramaSocial,
} from "@prisma/client";

export interface SalvarSituacaoVidaDTO {
  situacoesSaude?: SituacaoSaude[];
  situacaoSaudeOutra?: string | null;

  situacoesViolencia?: SituacaoViolencia[];
  situacaoViolenciaOutra?: string | null;

  acessoTransporte?: AcessoTransporte | null;

  identificacaoSituacao?: IdentificacaoSituacao | null;

  situacaoFamiliarInstavel?: SituacaoFamiliarInstavel | null;

  programaSocial?: ProgramaSocial | null;
  programaSocialOutro?: string | null;
}

