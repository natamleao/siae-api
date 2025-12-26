import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { ForgotPasswordData, ResetPasswordData } from '../models/models';

const handleError = (res: Response, error: any) => {
  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: error.message,
  });
};

export class AuthController {
  public static async forgotPassword(req: Request, res: Response): Promise<Response> {
    try {
      const data: ForgotPasswordData = req.body;
      if (!data.email) {
        return res.status(400).json({ success: false, message: 'Email é obrigatório' });
      }

      const result = await AuthService.forgotPassword(data);
      return res.status(200).json({ success: result.success, message: result.message });
    } catch (error: any) {
      return handleError(res, error);
    }
  }

  public static async resetPassword(req: Request, res: Response): Promise<Response> {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: 'Token e nova senha são obrigatórios' });
      }

      const result = await AuthService.resetPassword({ token, newPassword });
      const status = result.success ? 200 : 400;

      return res.status(status).json({ success: result.success, message: result.message });
    } catch (error: any) {
      return handleError(res, error);
    }
  }
}