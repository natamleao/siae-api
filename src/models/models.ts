export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    matricula?: string;
    permissao?: "ALUNO";
}

export interface AuthResult {
    success: boolean;
    token?: string;
    message?: string;
    user?: {
        id: number;
        email: string;
        permissao: string;
    };
}

export interface ForgotPasswordData {
    identifier: string;
}

export interface ResetPasswordData {
    token: string;
    newPassword: string;
}
