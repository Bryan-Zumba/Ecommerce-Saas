/*
  Warnings:

  - You are about to alter the column `nombre` on the `Caja` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `descripcion` on the `Caja` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `observacion` on the `Cierre_Periodo` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `observacion` on the `Compra` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `nombre` on the `Metodo_Pago` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `descripcion` on the `Metodo_Pago` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to drop the column `id_gasto_operativo` on the `Movimiento_caja` table. All the data in the column will be lost.
  - You are about to alter the column `referencia` on the `Movimiento_caja` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `observacion` on the `Periodo_Gestion` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `nombre` on the `Rol` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `descripcion` on the `Rol` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `observacion` on the `Venta` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to drop the `Gasto_operativo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id_empresa]` on the table `Bodega` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_empresa,nombre]` on the table `Caja` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_empresa,nombre]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_empresa,nombre]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_empresa,nombre]` on the table `Proveedor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Gasto_operativo" DROP CONSTRAINT "Gasto_operativo_id_empresa_fkey";

-- DropForeignKey
ALTER TABLE "Gasto_operativo" DROP CONSTRAINT "Gasto_operativo_id_periodo_contable_fkey";

-- DropForeignKey
ALTER TABLE "Gasto_operativo" DROP CONSTRAINT "Gasto_operativo_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "Movimiento_caja" DROP CONSTRAINT "Movimiento_caja_id_gasto_operativo_fkey";

-- AlterTable
ALTER TABLE "Caja" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Cierre_Periodo" ALTER COLUMN "observacion" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Compra" ALTER COLUMN "observacion" DROP NOT NULL,
ALTER COLUMN "observacion" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Metodo_Pago" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Movimiento_caja" DROP COLUMN "id_gasto_operativo",
ALTER COLUMN "referencia" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Periodo_Gestion" ALTER COLUMN "observacion" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Rol" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Venta" ALTER COLUMN "observacion" SET DATA TYPE VARCHAR(500);

-- DropTable
DROP TABLE "Gasto_operativo";

-- DropEnum
DROP TYPE "Tipo_gasto_operativo";

-- CreateIndex
CREATE UNIQUE INDEX "Bodega_id_empresa_key" ON "Bodega"("id_empresa");

-- CreateIndex
CREATE UNIQUE INDEX "Caja_id_empresa_nombre_key" ON "Caja"("id_empresa", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_id_empresa_nombre_key" ON "Categoria"("id_empresa", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Item_id_empresa_nombre_key" ON "Item"("id_empresa", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_id_empresa_nombre_key" ON "Proveedor"("id_empresa", "nombre");
