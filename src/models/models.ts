export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    matricula?: number;
    permissao?: "ALUNO" | "TECNICO" | "ASSISTENTE";
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
    email: string;
}

export interface ResetPasswordData {
    token: string;
    newPassword: string;
}
