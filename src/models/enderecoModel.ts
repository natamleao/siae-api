import { TipoMoradia, CondicaoMoradia } from "@prisma/client";

export interface SalvarEnderecoDTO {
  tipoMoradia: TipoMoradia;
  tipoMoradiaOutro?: string | null;
  condicaoMoradia: CondicaoMoradia;
  condicaoMoradiaOutro?: string | null;
  logradouro: string;
  numero: string;
  complemento?: string | null;
  bairro: string;
  municipio: string;
  estado: string;
//   cep?: string | null; //deixar comentado para casos futuros
  origemFamilia: string;
}
