-- CreateEnum
CREATE TYPE "Permissao" AS ENUM ('ADMIN', 'ALUNO', 'TECNICO', 'ASSISTENTE');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO', 'NAO_INFORMAR');

-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "TipoIngresso" AS ENUM ('SISU', 'TRANSFERENCIA', 'OUTRO');

-- CreateEnum
CREATE TYPE "SituacaoSaude" AS ENUM ('doencasGraves', 'cronicas', 'deficiencia', 'usomedicacaocontinua');

-- CreateEnum
CREATE TYPE "SituacaoOcupacional" AS ENUM ('propietarioEmpresa', 'microempreendedorIndividual', 'assalariado', 'aposentadoPensionista', 'informalAutonomo', 'pensaoAlimenticia', 'atividadeRural', 'bolsistaEstagiario', 'desempregado');

-- CreateEnum
CREATE TYPE "TipoMoradia" AS ENUM ('PROPRIA', 'ALUGADA', 'CEDIDA', 'REPUBLICA', 'ALOJAMENTO', 'OUTRO');

-- CreateEnum
CREATE TYPE "Parentesco" AS ENUM ('PAI', 'MAE', 'IRMAO', 'IRMA', 'AVÔ', 'AVÓ', 'TIO', 'TIA', 'PRIMO', 'PRIMA', 'CONJUGE', 'OUTRO');

-- CreateEnum
CREATE TYPE "Ocupacao" AS ENUM ('PROPRIETARIO_EMPRESA', 'MICROEMPREENDEDOR_INDIVIDUAL', 'ASSALARIADO', 'APOSENTADO_PENSIONISTA', 'INFORMAL_AUTONOMO', 'PENSAO_ALIMENTICIA', 'ATIVIDADE_RURAL', 'BOLSISTA_ESTAGIARIO', 'DESEMPREGADO');

-- CreateEnum
CREATE TYPE "TipoAuxilio" AS ENUM ('BOLSA', 'AUXILIO');

-- CreateEnum
CREATE TYPE "StatusAlunoAuxilio" AS ENUM ('ATIVO', 'ENCERRADO', 'SUSPENSO');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('RG', 'CPF');

-- CreateEnum
CREATE TYPE "StatusDocumento" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusSolicitacao" AS ENUM ('PENDENTE', 'EM_ANALISE', 'DEFERIDO', 'INDEFERIDO');

-- CreateEnum
CREATE TYPE "TipoResponsavel" AS ENUM ('PAI', 'MAE', 'PROPRIO', 'OUTRO');

-- CreateEnum
CREATE TYPE "IdentidadeGenero" AS ENUM ('MULHER_CISGENERO', 'HOMEM_CISGENERO', 'MULHER_TRANSGENERA', 'HOMEM_TRANSGENERO', 'NAO_BINARIO', 'OUTRO', 'NAO_INFORMAR');

-- CreateEnum
CREATE TYPE "OrientacaoSexual" AS ENUM ('HETEROSEXUAL', 'HOMOSSEXUAL', 'BISEXUAL', 'PANSEXUAL', 'ASSEXUAL', 'OUTRO', 'NAO_INFORMAR');

-- CreateEnum
CREATE TYPE "EtniaRaca" AS ENUM ('BRANCO', 'PRETO', 'PARDO', 'AMARELO', 'INDIGENA', 'NAO_INFORMAR');

-- CreateEnum
CREATE TYPE "TipoDeficiencia" AS ENUM ('NAO_POSSUI', 'ALTAS_HABILIDADES_SUPERDOTACAO', 'BAIXA_VISAO', 'CEGUEIRA', 'AUDITIVA', 'FISICA', 'INTELECTUAL', 'MENTAL', 'MULTIPLA', 'SENSORIAL', 'SINDROME_ASPERGER', 'TEA', 'TRANSTORNO_GLOBAL_DESENVOLVIMENTO', 'OUTRA');

-- CreateTable
CREATE TABLE "auth" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "permissao" "Permissao" NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aluno" (
    "id" SERIAL NOT NULL,
    "id_auth" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "rg" TEXT,
    "matricula" TEXT NOT NULL,
    "emailContato" TEXT,
    "telefone" TEXT,
    "curso" TEXT,
    "turno" TEXT,
    "anoIngresso" INTEGER,
    "semestreAtual" INTEGER,
    "tipoIngresso" TEXT,
    "dataNasc" DATE,
    "tipoResponsavel" "TipoResponsavel",
    "tipoResponsavelOutro" TEXT,
    "nomeResponsavel" TEXT,
    "sexo" "Sexo",
    "orientacaoSexual" "OrientacaoSexual",
    "orientacaoSexualOutro" TEXT,
    "identidadeGenero" "IdentidadeGenero",
    "identidadeGeneroOutro" TEXT,
    "etniaRaca" "EtniaRaca",
    "estadoCivil" "EstadoCivil",
    "tipoDeficiencia" "TipoDeficiencia",
    "tipoDeficienciaOutro" TEXT,
    "etapaCadastro" INTEGER,
    "cadastroFinalizado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" SERIAL NOT NULL,
    "id_auth" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "siape" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" SERIAL NOT NULL,
    "id_aluno" INTEGER NOT NULL,
    "tipoMoradia" "TipoMoradia" NOT NULL,
    "tipoMoradiaOutro" TEXT,
    "logradouro" TEXT NOT NULL,
    "numero_ap" TEXT NOT NULL,
    "complemento" TEXT,
    "cep" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parente" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "parentesco" "Parentesco" NOT NULL,
    "dataNasc" TIMESTAMP(3) NOT NULL,
    "ocupacao" "Ocupacao" NOT NULL,
    "rendaIndividual" DOUBLE PRECISION NOT NULL,
    "contribuicaoFamilia" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "parente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "composicao_parentesca" (
    "id_aluno" INTEGER NOT NULL,
    "id_parente" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "composicao_parentesca_pkey" PRIMARY KEY ("id_aluno","id_parente")
);

-- CreateTable
CREATE TABLE "auxilios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoAuxilio" "TipoAuxilio" NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "auxilios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos_auxilios" (
    "id" SERIAL NOT NULL,
    "id_aluno" INTEGER NOT NULL,
    "id_auxilio" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "status" "StatusAlunoAuxilio" NOT NULL,
    "observacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alunos_auxilios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacoes" (
    "id" SERIAL NOT NULL,
    "id_aluno" INTEGER NOT NULL,
    "id_auxilio" INTEGER NOT NULL,
    "id_funcionario" INTEGER,
    "status" "StatusSolicitacao" NOT NULL DEFAULT 'PENDENTE',
    "dataInicio" TIMESTAMP(3),
    "data_final_analise" TIMESTAMP(3),
    "observacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "solicitacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos" (
    "id" SERIAL NOT NULL,
    "id_aluno" INTEGER NOT NULL,
    "caminho" TEXT NOT NULL,
    "tipo_documento" "TipoDocumento" NOT NULL,
    "versao" INTEGER NOT NULL,
    "status" "StatusDocumento" NOT NULL,
    "hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentos_solicitacoes" (
    "id_solicitacao" INTEGER NOT NULL,
    "id_documento" INTEGER NOT NULL,
    "observacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documentos_solicitacoes_pkey" PRIMARY KEY ("id_solicitacao","id_documento")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_email_key" ON "auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_id_auth_key" ON "aluno"("id_auth");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_cpf_key" ON "aluno"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_rg_key" ON "aluno"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_matricula_key" ON "aluno"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_id_auth_key" ON "funcionarios"("id_auth");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_siape_key" ON "funcionarios"("siape");

-- CreateIndex
CREATE INDEX "endereco_id_aluno_idx" ON "endereco"("id_aluno");

-- CreateIndex
CREATE INDEX "composicao_parentesca_id_parente_idx" ON "composicao_parentesca"("id_parente");

-- CreateIndex
CREATE INDEX "alunos_auxilios_id_auxilio_idx" ON "alunos_auxilios"("id_auxilio");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_auxilios_id_aluno_id_auxilio_key" ON "alunos_auxilios"("id_aluno", "id_auxilio");

-- CreateIndex
CREATE INDEX "solicitacoes_id_aluno_idx" ON "solicitacoes"("id_aluno");

-- CreateIndex
CREATE INDEX "solicitacoes_id_auxilio_idx" ON "solicitacoes"("id_auxilio");

-- CreateIndex
CREATE INDEX "solicitacoes_id_funcionario_idx" ON "solicitacoes"("id_funcionario");

-- CreateIndex
CREATE INDEX "documentos_id_aluno_idx" ON "documentos"("id_aluno");

-- CreateIndex
CREATE INDEX "documentos_solicitacoes_id_documento_idx" ON "documentos_solicitacoes"("id_documento");

-- AddForeignKey
ALTER TABLE "aluno" ADD CONSTRAINT "aluno_id_auth_fkey" FOREIGN KEY ("id_auth") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_id_auth_fkey" FOREIGN KEY ("id_auth") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composicao_parentesca" ADD CONSTRAINT "composicao_parentesca_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "composicao_parentesca" ADD CONSTRAINT "composicao_parentesca_id_parente_fkey" FOREIGN KEY ("id_parente") REFERENCES "parente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alunos_auxilios" ADD CONSTRAINT "alunos_auxilios_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alunos_auxilios" ADD CONSTRAINT "alunos_auxilios_id_auxilio_fkey" FOREIGN KEY ("id_auxilio") REFERENCES "auxilios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_id_auxilio_fkey" FOREIGN KEY ("id_auxilio") REFERENCES "auxilios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes" ADD CONSTRAINT "solicitacoes_id_funcionario_fkey" FOREIGN KEY ("id_funcionario") REFERENCES "funcionarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_solicitacoes" ADD CONSTRAINT "documentos_solicitacoes_id_solicitacao_fkey" FOREIGN KEY ("id_solicitacao") REFERENCES "solicitacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos_solicitacoes" ADD CONSTRAINT "documentos_solicitacoes_id_documento_fkey" FOREIGN KEY ("id_documento") REFERENCES "documentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
