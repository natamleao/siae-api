import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Permissao } from "../enums/permissions";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('A variável JWT_SECRET não foi definida.');
}

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        permissao: Permissao;
    };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies?.authToken;

        const authHeader = req.headers.authorization;
        if (!token && authHeader) {
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7).trim();
            } else {
                token = authHeader.trim();
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ["HS256"]
        });

        if (
            typeof decoded !== "object" ||
            decoded === null ||
            !Number.isInteger(decoded.id) ||
            decoded.id <= 0 ||
            typeof decoded.email !== "string" ||
            !decoded.email.trim() ||
            !Object.values(Permissao).includes(decoded.permissao)
        ) {
            return res.status(401).json({
                success: false,
                message: "Token inválido ou expirado"
            });
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            permissao: decoded.permissao
        };

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
    if (req.user?.permissao === Permissao.ADMIN || req.user?.permissao === Permissao.ALUNO_ADMIN) {
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
        req.user?.permissao === Permissao.TECNICO ||
        req.user?.permissao === Permissao.ASSISTENTE ||
        req.user?.permissao === Permissao.ADMIN ||
        req.user?.permissao === Permissao.ALUNO_ADMIN
    ) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Você não tem permissão para entrar aqui'
        })
    }

};

export const requireAluno = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (
        req.user?.permissao === Permissao.ALUNO ||
        req.user?.permissao === Permissao.ALUNO_ADMIN
    ) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: "Necessário ser ALUNO."
        })
    }
}



export const requirePainelAdministrativo = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (
        req.user?.permissao === Permissao.TECNICO ||
        req.user?.permissao === Permissao.ASSISTENTE
    ) {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Acesso restrito a técnicos e assistentes."
    });
};
