export interface Opcao {
  valor: string;
  rotulo: string;
}

export interface OpcoesFormularioResponse {
  condicoesMoradia: Opcao[];
  situacoesOcupacionais: Opcao[];
}
