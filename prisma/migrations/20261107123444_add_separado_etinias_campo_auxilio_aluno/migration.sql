-- AlterEnum
ALTER TYPE "EstadoCivil" ADD VALUE 'SEPARADO';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EtniaRaca" ADD VALUE 'PRETO_QUILOMBOLA';
ALTER TYPE "EtniaRaca" ADD VALUE 'PRETO_NAO_QUILOMBOLA';
ALTER TYPE "EtniaRaca" ADD VALUE 'NAO_DECLARAR';

-- AlterTable
ALTER TABLE "aluno" ADD COLUMN     "auxilioGraduacaoDescricao" TEXT,
ADD COLUMN     "recebeuAuxilioGraduacao" BOOLEAN;
