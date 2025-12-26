import prisma from '../config/database';
import { Usuario } from '@prisma/client';

export class UserRepository {
  public static async findUserByEmail(email: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({ where: { email } });
  }

  public static async findUserById(id: number): Promise<Usuario | null> {
    return prisma.usuario.findUnique({ where: { id } });
  }

  public static async findUserByMatricula(matricula: number): Promise<Usuario | null> {
    return prisma.usuario.findUnique({ where: { matricula } });
  }


  public static async createUser(data: {
    email: string;
    senha: string;
    matricula?: number;
    permissao?: 'ALUNO' | 'TECNICO' | 'ASSISTENTE';
  }): Promise<Usuario> {
    return prisma.usuario.create({
      data: {
        email: data.email,
        senha: data.senha,
        matricula: data.matricula,
        permissao: data.permissao || 'ALUNO'
      }
    });
  }

  public static async updatePassword(id: number, newPassword: string): Promise<Usuario> {
    return prisma.usuario.update({
      where: { id },
      data: { senha: newPassword }
    });
  }

  public static async updateResetToken(id: number, resetToken: string | null, resetTokenExpiry: Date | null): Promise<Usuario> {
    return prisma.usuario.update({
      where: { id },
      data: { resetToken, resetTokenExpiry }
    });
  }

  public static async findUserByResetToken(token: string): Promise<Usuario | null> {
    return prisma.usuario.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }
      }
    });
  }
}