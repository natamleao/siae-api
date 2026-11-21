import { Router, Request, Response } from "express";
import prisma from "../config/database";

const router = Router();

router.get("/live", (_req: Request, res: Response) => {
    return res.status(200).json({
        success: true,
        status: "alive",
    });
});

router.get("/ready", async (_req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        return res.status(200).json({
            success: true,
            status: "ready",
            database: "connected",
        });
    } catch (error) {
        console.error("Verificação de prontidão falhou: banco indisponível.");

        return res.status(503).json({
            success: false,
            status: "not_ready",
            database: "unavailable",
        });
    }
});

export default router;
