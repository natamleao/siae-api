export interface Opcao {
  valor: string;
  rotulo: string;
}

export interface OpcoesFormularioResponse {
  condicoesMoradia: Opcao[];
  situacoesOcupacionais: Opcao[];
  situacoesSaude: Opcao[];
  situacoesViolencia: Opcao[];
  acessosTransporte: Opcao[];
  identificacoesSituacao: Opcao[];
  situacoesFamiliaresInstaveis: Opcao[];
  programasSociais: Opcao[];
}
