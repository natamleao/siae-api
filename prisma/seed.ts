import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const senhaHash = await bcrypt.hash("admin123", 10);

    await prisma.auth.create({
        data: {
            email: "admin@siae.br",
            senha: senhaHash,
            permissao: "ADMIN"
        }
    });

    console.log("Admin criado com sucesso!");
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());