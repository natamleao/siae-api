import { UserRepository } from "../repository/userRepository";

interface LoginData {
  email: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  token?: string;
}

export class AuthService {
  public static async authenticate(data: LoginData): Promise<AuthResult> {
    const { email, password } = data;

    const user = await UserRepository.findUserByEmail(email);

    if (user && user.password === password) {
      const token = `JWT_${user.id}`;
      return { success: true, token };
    }

    return { success: false };
  }
}