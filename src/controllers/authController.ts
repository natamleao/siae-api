import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { RegisterData } from '../models/models';

const handleError = (res: Response, error: any) => {
	return res.status(500).json({
		success: false,
		message: 'Erro interno do servidor',
		error: error.message
	});
};

export class AuthController {
	public static async login(req: Request, res: Response): Promise<Response> {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
			}
			
			const result = await AuthService.authenticate({ email, password });
			const status = result.success ? 200 : 401;

			return res.status(status).json({
				success: result.success,
				message: result.success ? 'Login realizado com sucesso' : result.message,
				...(result.token && { token: result.token }),
				...(result.user && { user: result.user })
			});
		} catch (error: any) {
			return handleError(res, error);
		}
	}

	public static async register(req: Request, res: Response): Promise<Response> {
		try {
			const data: RegisterData = req.body;
			if (!data.email || !data.password) {
				return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
			}
			
			const result = await AuthService.register(data);
			const status = result.success ? 201 : 400;

			return res.status(status).json({
				success: result.success,
				message: result.message,
				...(result.token && { token: result.token }),
				...(result.user && { user: result.user })
			});
		} catch (error: any) {
			return handleError(res, error);
		}
	}
}