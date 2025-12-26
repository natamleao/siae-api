import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { AuthResult, ForgotPasswordData, ResetPasswordData } from "../models/models";
import { UserRepository } from "../repository/userRepository";
import { Usuario } from '@prisma/client';

const RESET_TOKEN_EXPIRY_HOURS = 1;

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

    // Em produção, envie email com o token em vez de logar
    console.log(`Token de recuperação para ${email}: ${resetToken}`);

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

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserRepository.updatePassword(user.id, hashedPassword);
    await UserRepository.updateResetToken(user.id, null, null);

    return { success: true, message: 'Senha redefinida com sucesso' };
  }
}