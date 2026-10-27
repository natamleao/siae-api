import { SituacaoMoradia, CondicaoMoradia } from "@prisma/client";

export interface SalvarEnderecoDTO {
  situacaoMoradia: SituacaoMoradia;
  situacaoMoradiaOutro?: string | null;
  condicaoMoradia: CondicaoMoradia;
  condicaoMoradiaOutro?: string | null;
  logradouro: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  municipio: string;
  estado: string;
  cep?: string | null;
  origemFamilia: string | null;
}
