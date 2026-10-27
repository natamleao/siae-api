import { TipoResponsavel, Sexo, IdentidadeGenero, OrientacaoSexual, EtniaRaca, EstadoCivil, TipoDeficiencia } from "@prisma/client";

export interface RegisterAlunoData {
    nome: string;
    matricula: string;
    email: string;
    senha: string;
}

export interface UpdateAlunoData {
    cpf?: string;
    rg?: string;
    emailContato?: string;
    telefone?: string;
    curso?: string;
    turno?: string;
    anoIngresso?: number;
    semestreAtual?: number;
    tipoIngresso?: string;
    dataNasc?: string;
    sexo?: Sexo;
    orientacaoSexual?: OrientacaoSexual;
    identidadeGenero?: IdentidadeGenero;
    etniaRaca?: EtniaRaca;
    estadoCivil?: EstadoCivil;
    deficiencia?: TipoDeficiencia;
}

export interface IdentificacaoPessoalData {
    nome?: string;
    cpf?: string;
    rg?: string;
    dataNasc?: string;
    telefone?: string;
    tipoResponsavel?: TipoResponsavel;
    tipoResponsavelOutro?: string | null;
    nomeResponsavel?: string;
    sexo?: Sexo;
    identidadeGenero?: IdentidadeGenero;
    identidadeGeneroOutro?: string | null;
    orientacaoSexual?: OrientacaoSexual;
    orientacaoSexualOutro?: string | null;
    etniaRaca?: EtniaRaca;
    estadoCivil?: EstadoCivil;
    tipoDeficiencia?: TipoDeficiencia;
    tipoDeficienciaOutro?: string | null;
}

export interface AlunoRegisterResponse {
    id: number;
    nome: string;
    matricula: string;
    email: string;
    permissao: string;
    token: string;
}

