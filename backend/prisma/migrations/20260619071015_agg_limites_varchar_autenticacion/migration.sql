/*
  Warnings:

  - You are about to alter the column `email` on the `Acceso_Autorizado` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `codigo_acceso` on the `Acceso_Autorizado` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(50)`.
  - You are about to alter the column `nombre` on the `Acceso_Autorizado` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `nombre` on the `Bodega` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(150)`.
  - You are about to alter the column `descripcion` on the `Bodega` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `ubicacion` on the `Bodega` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(300)`.
  - You are about to alter the column `nombre` on the `Empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(150)`.
  - You are about to alter the column `descripcion` on the `Empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `ruc` on the `Empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
  - You are about to alter the column `direccion` on the `Empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(300)`.
  - You are about to alter the column `telefono` on the `Empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
  - You are about to alter the column `email` on the `Empresa` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `nombre` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `apellido` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `telefono` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
  - You are about to alter the column `email` on the `Usuario` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - Added the required column `id_empresa` to the `Acceso_Autorizado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Acceso_Autorizado" ADD COLUMN     "id_empresa" INTEGER NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "codigo_acceso" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Bodega" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "ubicacion" SET DATA TYPE VARCHAR(300);

-- AlterTable
ALTER TABLE "Empresa" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(150),
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "ruc" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "telefono" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "logo_url" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "apellido" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "telefono" DROP NOT NULL,
ALTER COLUMN "telefono" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password_hash" SET DATA TYPE TEXT,
ALTER COLUMN "ultimo_acceso" DROP NOT NULL,
ALTER COLUMN "ultimo_acceso" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Acceso_Autorizado" ADD CONSTRAINT "Acceso_Autorizado_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;
