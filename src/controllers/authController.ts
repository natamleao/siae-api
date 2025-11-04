import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  public static async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const result = await AuthService.authenticate({ email, password });

    if (result.success) {
      return res.status(200).json({
        message: 'Login realizado com sucesso',
        token: result.token,
      });
    } else {
      return res.status(401).json({
        message: 'Credenciais inválidas',
      });
    }
  }
}