import { TipoResponsavel, Sexo, IdentidadeGenero, OrientacaoSexual, EtniaRaca, EstadoCivil, TipoDeficiencia } from "@prisma/client";

export interface RegisterAlunoData {
    nome: string;
    matricula: string;
    email: string;
    senha: string;
}

export interface IdentificacaoPessoalData {
    nome?: string;
    cpf?: string;
    rg?: string;
    dataNasc?: string;
    telefone?: string;
    emailContato?: string | null;
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

export interface DadosAcademicosData {
    matricula?: string;
    curso?: string;
    turno?: string;
    tipoIngresso?: string;
    anoIngresso?: number;
    semestreAtual?: number;
    recebeuAuxilioGraduacao?: boolean | string;
    auxilioGraduacaoDescricao?: string | null;
}

export interface AlunoRegisterResponse {
    id: number;
    nome: string;
    matricula: string;
    email: string;
    permissao: string;
    token: string;
}

