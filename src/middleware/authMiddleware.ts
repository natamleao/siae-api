import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'KEY';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        permissao: string;
    };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.authToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.user = decoded;
        next();
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido ou expirado'
        });
    }
};

export const logout = (req: Request, res: Response): Response => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });

    return res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
    });
};
