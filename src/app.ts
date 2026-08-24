import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import funcionarioRoutes from "./routes/funcionarioRoutes"

const PORT = process.env.PORT || 3000;
const app = express();

// Pra rapaizada que for mexer no código, isso aqui não é uma boa
// prática qquando for colcoar em produção, ok?
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "API SIAE está rodando com sucesso! 🚀",
        status: "online",
        timestamp: new Date().toISOString()
    });
});

app.use("/auth", authRoutes);
app.use("/funcionario", funcionarioRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
