-- CreateEnum
CREATE TYPE "SituacaoViolencia" AS ENUM ('VIOLENCIA_DOMESTICA', 'VIOLENCIA_PSICOLOGICA', 'VIOLENCIA_COMUNIDADE_URBANA', 'OUTRA', 'NAO');

-- CreateEnum
CREATE TYPE "AcessoTransporte" AS ENUM ('NAO_TENHO_ACESSO', 'TRANSPORTE_PAGO_COM_DIFICULDADE', 'TRANSPORTE_PAGO_SEM_DIFICULDADE', 'TRANSPORTE_GRATUITO_COM_DIFICULDADE', 'TRANSPORTE_GRATUITO_SEM_DIFICULDADE');

-- CreateEnum
CREATE TYPE "IdentificacaoSituacao" AS ENUM ('GESTANTE', 'TEM_FILHOS', 'NAO');

-- CreateEnum
CREATE TYPE "SituacaoFamiliarInstavel" AS ENUM ('SIM', 'NAO');

-- CreateEnum
CREATE TYPE "ProgramaSocial" AS ENUM ('BOLSA_FAMILIA', 'BPC_LOAS', 'SEGURO_SAFRA', 'OUTRO', 'NAO');

-- RecreateEnum SituacaoSaude
DROP TYPE IF EXISTS "SituacaoSaude";
CREATE TYPE "SituacaoSaude" AS ENUM ('DOENCA_CRONICA', 'DOENCA_GRAVE', 'DEFICIENCIA', 'USO_CONTINUO_MEDICAMENTO', 'OUTRA', 'NAO');

-- CreateTable
CREATE TABLE "situacoes_vida" (
    "id" SERIAL NOT NULL,
    "id_aluno" INTEGER NOT NULL,
    "situacoes_saude" "SituacaoSaude"[],
    "situacao_saude_outra" TEXT,
    "situacoes_violencia" "SituacaoViolencia"[],
    "situacao_violencia_outra" TEXT,
    "acesso_transporte" "AcessoTransporte",
    "identificacao_situacao" "IdentificacaoSituacao",
    "situacao_familiar_instavel" "SituacaoFamiliarInstavel",
    "programa_social" "ProgramaSocial",
    "programa_social_outro" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "situacoes_vida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "situacoes_vida_id_aluno_key" ON "situacoes_vida"("id_aluno");

-- CreateIndex
CREATE INDEX "situacoes_vida_id_aluno_idx" ON "situacoes_vida"("id_aluno");

-- AddForeignKey
ALTER TABLE "situacoes_vida" ADD CONSTRAINT "situacoes_vida_id_aluno_fkey" FOREIGN KEY ("id_aluno") REFERENCES "aluno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

