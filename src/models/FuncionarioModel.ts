import { Permissao } from "../enums/permissions";

export interface RegisterFuncionarioData {
    nome: string;
    siape: number;
    email: string;
    senha: string;
    permissao: Permissao.TECNICO | Permissao.ASSISTENTE;
}

export interface FuncionarioData {
    nome: string;
    siape: number;
}

export interface UpdateFuncionarioData {
    nome?: string;
    siape?: number;
}

export interface FuncionarioPerfilResponse {
    id: number;
    nome: string;
    siape: number;
    email: string
    permissao: string
}

export interface AlunoListResponse {
    id: number;
    nome: string;
    matricula: number;
    email: string;
    curso?: string;
    turno?: string;
    status?: string;
}