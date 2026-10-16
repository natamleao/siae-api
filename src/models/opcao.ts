export interface Opcao {
  valor: string;
  rotulo: string;
}

export interface OpcoesFormularioResponse {
  situacoesMoradia: Opcao[];
  condicoesMoradia: Opcao[];
  situacoesOcupacionais: Opcao[];
}