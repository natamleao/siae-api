import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import authRoutes from "./routes/authRoutes";
import funcionarioRoutes from "./routes/funcionarioRoutes";

const PORT = process.env.PORT || 3000;
const app = express();

// Pra rapaizada que for mexer no código, isso aqui não é uma boa
// prática quando for colocar em produção, ok?
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota da documentação interativa Swagger
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota para obter o JSON da especificação OpenAPI
app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

app.get("/", (req, res) => {
    res.status(200).json({
        message: "API SIAE está rodando com sucesso! 🚀",
        status: "online",
        docs: "/docs",
        timestamp: new Date().toISOString()
    });
});

app.use("/auth", authRoutes);
app.use("/funcionario", funcionarioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação Swagger disponível em: http://localhost:${PORT}/docs`);
});

export default app;
