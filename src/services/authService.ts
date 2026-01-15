import bcrypt from 'bcryptjs';
import { UserRepository } from "../repository/userRepository";
import jwt from 'jsonwebtoken';
import { ForgotPasswordData, ResetPasswordData, LoginData, RegisterData, AuthResult } from "../models/models";
import { Usuario } from '@prisma/client';
import crypto from 'crypto';

const RESET_TOKEN_EXPIRY_HOURS = 1;
const JWT_SECRET = process.env.JWT_SECRET || 'KEY';
const JWT_EXPIRES_IN = '7d';

const generateToken = (user: Usuario): string => {
    return jwt.sign(
        { id: user.id, email: user.email, permissao: user.permissao },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

const formatUser = (user: Usuario) => ({
    id: user.id,
    email: user.email,
    permissao: user.permissao
});

export class AuthService {
    public static async forgotPassword(data: ForgotPasswordData): Promise<AuthResult> {
        const { email } = data;
        const user = await UserRepository.findUserByEmail(email);

        if (!user) {
            return { success: true, message: 'Se o email existir, você receberá um link de recuperação' };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + RESET_TOKEN_EXPIRY_HOURS);

        await UserRepository.updateResetToken(user.id, resetToken, resetTokenExpiry);

        return { success: true, message: 'Se o email existir, você receberá um link de recuperação' };
    }

    public static async resetPassword(data: ResetPasswordData): Promise<AuthResult> {
        const { token, newPassword } = data;

        if (newPassword.length < 6) {
            return { success: false, message: 'A senha deve ter pelo menos 6 caracteres' };
        }

        const user = await UserRepository.findUserByResetToken(token);
        if (!user) {
            return { success: false, message: 'Token inválido ou expirado' };
        }

        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await UserRepository.updatePasswordAndClearToken(user.id, hashedPassword);

            return { success: true, message: 'Senha alterada com sucesso' };
        } catch (error: any) {
            return { success: false, message: 'Erro ao redefinir senha: ' + error.message };
        }
    }

    public static async authenticate(data: LoginData): Promise<AuthResult> {
        const { email, password } = data;

        const user = await UserRepository.findUserByEmail(email);
        if (!user) {
            return { success: false, message: 'Credenciais inválidas' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.senha);
        if (!isPasswordValid) {
            return { success: false, message: 'Credenciais inválidas' };
        }

        return {
            success: true,
            token: generateToken(user),
            user: formatUser(user)
        };
    }

    public static async register(data: RegisterData): Promise<AuthResult> {
        const { email, password, matricula, permissao } = data;

        const existingUser = await UserRepository.findUserByEmail(email);
        if (existingUser) {
            return { success: false, message: 'Email já cadastrado' };
        }

        if (matricula) {
            const existingMatricula = await UserRepository.findUserByMatricula(matricula);
            if (existingMatricula) {
                return { success: false, message: 'Matrícula já cadastrada' };
            }
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await UserRepository.createUser({
                email,
                senha: hashedPassword,
                matricula,
                permissao
            });

            return {
                success: true,
                token: generateToken(user),
                message: 'Usuário cadastrado com sucesso',
                user: formatUser(user)
            };
        } catch (error: any) {
            return { success: false, message: 'Erro ao cadastrar usuário: ' + error.message };
        }
    }
}