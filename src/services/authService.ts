import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthResult, LoginData, RegisterData } from "../models/models";
import { UserRepository } from "../repository/userRepository";
import { Usuario } from '@prisma/client';

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