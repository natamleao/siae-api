import "dotenv/config";
import prisma from "./database";
import { seedDatabase } from "./seed";
import { logError } from "../utils/logger.js";

async function main(): Promise<void> {
    try {
        console.log("🌱 Executando seed do banco de dados...");
        await seedDatabase();
        console.log("✅ Seed concluído com sucesso!");
    } catch (error) {
        logError("Falha ao executar seed do banco de dados", error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

void main();
