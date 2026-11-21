import bcrypt from "bcryptjs";
import prisma from "./database";
import { TipoAuxilio } from "@prisma/client";
import { validatePassword } from '../utils/passwordValidator';

function requiredEnv(name: string): string {
    const value = process.env[name];

    if (!value || !value.trim()) {
        throw new Error(`Variável de ambiente obrigatória não definida: ${name}`);
    }

    return value;
}

export async function seedDatabase(): Promise<void> {
    const adminEmail = requiredEnv("SEED_ADMIN_EMAIL").trim();
    const adminPassword = requiredEnv("SEED_ADMIN_PASSWORD");

    const alunoAdminEmail = requiredEnv("SEED_ALUNO_ADMIN_EMAIL").trim();
    const alunoAdminPassword = requiredEnv("SEED_ALUNO_ADMIN_PASSWORD");
    const alunoAdminMatricula = requiredEnv("SEED_ALUNO_ADMIN_MATRICULA").trim();

    if (adminEmail.toLowerCase() === alunoAdminEmail.toLowerCase()) {
        throw new Error("As contas ADMIN e ALUNO_ADMIN devem utilizar e-mails diferentes.");
    }

    if (!validatePassword(adminPassword) || !validatePassword(alunoAdminPassword)) {
        throw new Error('As senhas administrativas devem ter de 8 a 16 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial permitido (! @ # $ % & * - _).');
    }

    // 1. Administrador
    const existingAdmin = await prisma.auth.findUnique({
        where: { email: adminEmail }
    });

    if (!existingAdmin) {
        const senhaHash = await bcrypt.hash(adminPassword, 12);

        await prisma.auth.create({
            data: {
                email: adminEmail,
                senha: senhaHash,
                permissao: "ADMIN"
            }
        });

        console.log("🌱 Administrador criado com sucesso.");
    } else if (existingAdmin.permissao !== "ADMIN") {
        throw new Error(`A conta ${adminEmail} já existe com outra permissão.`);
    } else {
        console.log("ℹ️ Administrador já existe.");
    }

    // 2. Aluno Administrador
    const existingAlunoAdmin = await prisma.auth.findUnique({
        where: { email: alunoAdminEmail }
    });

    let alunoAdminAuthId: number;

    if (existingAlunoAdmin) {
        if (existingAlunoAdmin.permissao !== "ALUNO_ADMIN") {
            throw new Error(`A conta ${alunoAdminEmail} já existe com outra permissão.`);
        }

        alunoAdminAuthId = existingAlunoAdmin.id;
        console.log("ℹ️ Aluno administrador já existe.");
    } else {
        const senhaHash = await bcrypt.hash(alunoAdminPassword, 12);

        const auth = await prisma.auth.create({
            data: {
                email: alunoAdminEmail,
                senha: senhaHash,
                permissao: "ALUNO_ADMIN"
            }
        });

        alunoAdminAuthId = auth.id;
        console.log("🌱 Aluno administrador criado com sucesso.");
    }

    const existingAluno = await prisma.aluno.findUnique({
        where: { authId: alunoAdminAuthId }
    });

    if (!existingAluno) {
        await prisma.aluno.create({
            data: {
                authId: alunoAdminAuthId,
                nome: "Aluno Administrador",
                matricula: alunoAdminMatricula
            }
        });

        console.log("🌱 Cadastro de aluno administrador criado.");
    }

    // 3. Auxílios padrão
    const auxilios = [
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
    ];

    for (const auxilio of auxilios) {
        const existingAuxilio = await prisma.auxilio.findFirst({
            where: {
                nome: auxilio.nome,
                tipoAuxilio: auxilio.tipoAuxilio
            }
        });

        if (!existingAuxilio) {
            await prisma.auxilio.create({
                data: auxilio
            });

            console.log(`🌱 Auxílio criado: ${auxilio.nome}`);
        } else {
            console.log(`ℹ️ Auxílio já existe: ${auxilio.nome}`);
        }
    }
}
