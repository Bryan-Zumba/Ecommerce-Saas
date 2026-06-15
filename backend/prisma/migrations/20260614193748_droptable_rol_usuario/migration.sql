/*
  Warnings:

  - You are about to drop the `Rol_usuario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `Rol` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_rol` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rol_usuario" DROP CONSTRAINT "Rol_usuario_id_rol_fkey";

-- DropForeignKey
ALTER TABLE "Rol_usuario" DROP CONSTRAINT "Rol_usuario_id_usuario_fkey";

-- DropIndex
DROP INDEX "Empresa_ruc_key";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "id_rol" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Rol_usuario";

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;
