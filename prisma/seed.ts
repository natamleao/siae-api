import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "admin@siae.br";

    const existingAdmin = await prisma.auth.findUnique({
        where: { email: adminEmail }
    });

    if (!existingAdmin) {
        const senhaHash = await bcrypt.hash("admin123", 10);

        await prisma.auth.create({
            data: {
                email: adminEmail,
                senha: senhaHash,
                permissao: "ADMIN"
            }
        });

        console.log("🌱 [Seed] Usuário Administrador criado com sucesso! (admin@siae.br / admin123)");
    } else {
        console.log("ℹ️ [Seed] Usuário Administrador já existe no banco de dados.");
    }
}

main()
    .catch((e) => {
        console.error("❌ [Seed] Erro ao executar o seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });