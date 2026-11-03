import { TipoAuxilio } from "@prisma/client";

export interface CreateAuxilioDTO {
    nome: string;
    tipoAuxilio: TipoAuxilio;
    descricao?: string | null;
}
