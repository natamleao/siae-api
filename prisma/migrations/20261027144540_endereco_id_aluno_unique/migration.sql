/*
  Warnings:

  - You are about to drop the column `tipoMoradia` on the `endereco` table. All the data in the column will be lost.
  - You are about to drop the column `tipoMoradiaOutro` on the `endereco` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_aluno]` on the table `endereco` will be added. If there are existing duplicate values, this will fail.

*/

-- CreateIndex
CREATE UNIQUE INDEX "endereco_id_aluno_key" ON "endereco"("id_aluno");
