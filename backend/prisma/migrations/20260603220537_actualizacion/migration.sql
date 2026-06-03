/*
  Warnings:

  - Added the required column `id_bodega` to the `Turno_caja` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Turno_caja" ADD COLUMN     "id_bodega" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Turno_caja" ADD CONSTRAINT "Turno_caja_id_bodega_fkey" FOREIGN KEY ("id_bodega") REFERENCES "Bodega"("id_bodega") ON DELETE RESTRICT ON UPDATE CASCADE;
