import "dotenv/config";
import prisma from "./database";
import { seedDatabase } from "./seed";

async function main(): Promise<void> {
    try {
        console.log("🌱 Executando seed do banco de dados...");
        await seedDatabase();
        console.log("✅ Seed concluído com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao executar seed:", error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

void main();
