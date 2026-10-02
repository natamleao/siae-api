
export interface RegisterAlunoData {
    nome: string;
    matricula: string; //ruan eu troquei de number para string, no prisma está como string
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
    dataNasc?: Date;
    sexo?: string;
    orientacaoSexual?: string;
    identidadeGenero?: string;
    etniaRaca?: string;
    estadoCivil?: string;
    deficiencia?: string;
}

export interface AlunoRegisterResponse {
    id: number;
    nome: string;
    matricula: string; //novamente modificando do scopo original
    email: string;
    permissao: string;
    token: string;
}

