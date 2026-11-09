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

    // 1.1 Seed do Aluno Administrador (ALUNO_ADMIN)
    const alunoAdminEmail = "alunoadmin@siae.br";

    const existingAlunoAdmin = await prisma.auth.findUnique({
        where: { email: alunoAdminEmail }
    });

    if (!existingAlunoAdmin) {
        const senhaHash = await bcrypt.hash("admin123", 10);

        await prisma.$transaction(async (tx) => {
            const auth = await tx.auth.create({
                data: {
                    email: alunoAdminEmail,
                    senha: senhaHash,
                    permissao: "ALUNO_ADMIN"
                }
            });

            await tx.aluno.create({
                data: {
                    authId: auth.id,
                    nome: "Aluno Administrador",
                    matricula: "0000000000"
                }
            });
        });

        console.log("🌱 [Seed] Usuário Aluno Administrador criado com sucesso! (alunoadmin@siae.br / admin123)");
    } else {
        console.log("ℹ️ [Seed] Usuário Aluno Administrador já existe.");
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
        console.log("🌱 [Seed] Verificando sementes iniciais do banco de dados...");
        await seedDatabase();
        console.log("✅ [Seed] Verificação de sementes concluída com sucesso!");
    } catch (error) {
        console.error("⚠️ [Seed] Não foi possível verificar ou executar o seed automático:", error);
    }
}
