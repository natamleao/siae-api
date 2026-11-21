import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorMiddleware } from "./middleware/errorMiddleware";
import authRoutes from "./routes/authRoutes";
import funcionarioRoutes from "./routes/funcionarioRoutes";
import opcoesRoutes from "./routes/opcoesRoutes";
import alunoRoutes from "./routes/alunoRoutes";
import solicitacaoRoutes from "./routes/solicitacaoRoutes";
import auxilioRoutes from "./routes/auxilioRoutes";
import healthRoutes from "./routes/healthRoutes";

const PORT = process.env.PORT || 3000;
const app = express();

const corsOrigin = process.env.CORS_ORIGIN;

const configuredOrigins = (corsOrigin || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

if (process.env.NODE_ENV === "production" && configuredOrigins.length === 0) {
    throw new Error(
        "A variável CORS_ORIGIN deve conter pelo menos uma origem válida em produção."
    );
}

const allowedOrigins = configuredOrigins.length > 0
    ? configuredOrigins
    : ["http://localhost:5173", "http://localhost:8080"];

// Pra rapaizada que for mexer no código, isso aqui não é uma boa
// prática quando for colocar em produção, ok?
app.use(cors({
    origin: (origin, callback) => {
        callback(null, !origin || allowedOrigins.includes(origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Documentação Swagger disponível apenas fora de produção
if (process.env.NODE_ENV !== "production") {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get("/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
}

app.get("/", (req, res) => {
    res.status(200).json({
        message: "API SIAE está rodando com sucesso! 🚀",
        status: "online",
        ...(process.env.NODE_ENV !== "production" ? { docs: "/docs" } : {}),
        timestamp: new Date().toISOString()
    });
});

//ROTAS

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/funcionario", funcionarioRoutes);
app.use("/opcoes", opcoesRoutes);
app.use("/aluno", alunoRoutes);
app.use("/solicitacao", solicitacaoRoutes);
app.use("/auxilio", auxilioRoutes);

// Middleware global para tratamento de erros
app.use(errorMiddleware);

app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);

    if (process.env.NODE_ENV !== "production") {
        console.log(`Documentação Swagger disponível em: http://localhost:${PORT}/docs`);
    }
});

export default app;
