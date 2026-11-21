import { ErrorRequestHandler } from "express";
import { logError } from "../utils/logger.js";

export const errorMiddleware: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error?.type === "entity.too.large" || error?.status === 413) {
        logError("Payload da requisição excede o limite", error);

        return res.status(413).json({
            success: false,
            message: "O conteúdo enviado excede o tamanho máximo permitido.",
        });
    }

    logError(`Erro interno durante requisição ${req.method}`, error);

    return res.status(500).json({
        success: false,
        message: "Erro interno do servidor.",
    });
};
