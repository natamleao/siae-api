import bcrypt from "bcryptjs";
import prisma from "./database";
import { TipoAuxilio } from "@prisma/client";

/**
 * Cria os registros iniciais padrão no banco de dados caso ainda não existam.
 */
export async function seedDatabase(): Promise<void> {
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
        console.log("ℹ️ [Seed] Usuário Administrador já existe.");
    }
    // 2. Seed dos Auxílios Padrão
    const countAuxilios = await prisma.auxilio.count();
    if (countAuxilios === 0) {
        await prisma.auxilio.createMany({
            data: [
                {
                    nome: "Auxílio Moradia",
                    tipoAuxilio: TipoAuxilio.AUXILIO,
                    descricao: "Auxílio financeiro destinado a subsidiar despesas com moradia de estudantes em vulnerabilidade socioeconômica."
                },
                {
                    nome: "Auxílio Alimentação",
                    tipoAuxilio: TipoAuxilio.AUXILIO,
                    descricao: "Auxílio para custeio de alimentação para alunos com renda per capita restrita."
                },
                {
                    nome: "Bolsa Permanência",
                    tipoAuxilio: TipoAuxilio.BOLSA,
                    descricao: "Bolsa destinada a estudantes de cursos de graduação presencial para viabilizar sua permanência acadêmica."
                },
                {
                    nome: "Auxílio Transporte",
                    tipoAuxilio: TipoAuxilio.AUXILIO,
                    descricao: "Subsidia custos de locomoção diária entre a residência e o campus."
                }
            ]
        });
        console.log("🌱 [Seed] Auxílios iniciais cadastrados com sucesso!");
    }
}

/**
 * Verifica se o banco de dados está vazio (sem usuários cadastrados)
 * e executa o seed inicial automaticamente.
 */
export async function checkAndSeedDatabase(): Promise<void> {
    try {
        const count = await prisma.auth.count();

        if (count === 0) {
            console.log("🌱 [Seed] Banco de dados vazio detectado. Executando seed inicial automático...");
            await seedDatabase();
            console.log("✅ [Seed] Inicialização do banco de dados concluída com sucesso!");
        } else {
            console.log("ℹ️ [Seed] Banco de dados já populado. Seed automático ignorado.");
        }
    } catch (error) {
        console.error("⚠️ [Seed] Não foi possível verificar ou executar o seed automático:", error);
    }
}
