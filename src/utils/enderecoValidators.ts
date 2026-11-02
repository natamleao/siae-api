import { TipoMoradia, CondicaoMoradia } from "@prisma/client";

export const UFS_BRASIL = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
] as const;

export function isUfValida(uf: string): boolean {
  return UFS_BRASIL.includes(uf.toUpperCase() as any);
}

export function isTipoMoradiaValida(valor: any): valor is TipoMoradia {
  return Object.values(TipoMoradia).includes(valor);
}

export function isCondicaoMoradiaValida(valor: any): valor is CondicaoMoradia {
  return Object.values(CondicaoMoradia).includes(valor);
}
