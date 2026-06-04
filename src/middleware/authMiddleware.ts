import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Permissao } from "../enums/permissions";

const JWT_SECRET = process.env.JWT_SECRET || 'KEY';

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        permissao: string;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
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

}
    export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
        if (req.user?.permissao === Permissao.ADMIN) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Você não tem permissão de admin'
            })
        }
    }

    export const requireFuncionario = (req: AuthRequest, res: Response, next: NextFunction) => {
        if (
            req.user?.permissao === Permissao.TECNICO || req.user?.permissao === Permissao.ASSISTENTE
        ) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Você não tem permissão para entrar aqui'
            })
        }
    
};

