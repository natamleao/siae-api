import bcrypt from 'bcryptjs';
import { AuthRepository } from "../repository/authRepository";
import jwt from 'jsonwebtoken';
import { ForgotPasswordData, ResetPasswordData, LoginData, RegisterData, AuthResult } from "../models/models";
import { Auth } from '@prisma/client';
import crypto from 'crypto';
import { EmailService } from './emailService';
import prisma from '../config/database';

const RESET_TOKEN_EXPIRY_MINUTES = 5;
const JWT_SECRET = process.env.JWT_SECRET || 'KEY';
const JWT_EXPIRES_IN = '7d';

const generateToken = (user: Auth): string => {
    return jwt.sign(
        { id: user.id, email: user.email, permissao: user.permissao },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

const formatUser = (user: Auth) => ({
    id: user.id,
    email: user.email,
    permissao: user.permissao
});

export class AuthService {
    public static async forgotPassword(data: ForgotPasswordData): Promise<AuthResult> {
        const { email } = data;
        const user = await AuthRepository.findAuthByEmail(email);

        if (!user) {
            return { success: true, message: 'Se o email existir, você receberá um link de recuperação' };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setMinutes(resetTokenExpiry.getMinutes() + RESET_TOKEN_EXPIRY_MINUTES);

        await AuthRepository.updateResetToken(user.id, resetToken, resetTokenExpiry);

        try {
            await EmailService.sendResetPasswordEmail(user.email, resetToken);
        } catch (error) {
            console.error('Erro ao enviar email:', error);
        }

        return { success: true, message: 'Se o email existir, você receberá um link de recuperação' };
    }

    public static async resetPassword(data: ResetPasswordData): Promise<AuthResult> {
        const { token, newPassword } = data;

        if (newPassword.length < 6) {
            return { success: false, message: 'A senha deve ter pelo menos 6 caracteres' };
        }

        const user = await AuthRepository.findAuthByResetToken(token);
        if (!user) {
            return { success: false, message: 'Token inválido ou expirado' };
        }

        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await AuthRepository.updatePasswordAndClearToken(user.id, hashedPassword);

            return { success: true, message: 'Senha alterada com sucesso' };
        } catch (error: any) {
            return { success: false, message: 'Erro ao redefinir senha: ' + error.message };
        }
    }

    public static async authenticate(data: LoginData): Promise<AuthResult> {
        const { email, password } = data;

        const user = await AuthRepository.findAuthByEmail(email);
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
        const { email, password, permissao } = data;

        const existing = await AuthRepository.findAuthByEmail(email);
        if (existing) {
            return { success: false, message: 'Email já cadastrado' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await prisma.auth.create({
            data: {
                email,
                senha: hashedPassword,
                permissao: (permissao as any) || 'ALUNO',
            }
        });

        return {
            success: true,
            message: 'Usuário cadastrado com sucesso',
            token: generateToken(createdUser),
            user: formatUser(createdUser)
        };
    }
}