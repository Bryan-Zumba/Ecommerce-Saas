/*
  Warnings:

  - You are about to alter the column `nombre` on the `Categoria` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `descripcion` on the `Categoria` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `cedula` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
  - You are about to alter the column `nombres` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `apellidos` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `email` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `telefono` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
  - You are about to alter the column `direccion` on the `Cliente` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(300)`.
  - You are about to alter the column `nombre` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `descripcion` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `imagen_url` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `nombre` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `descripcion` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `direccion` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(300)`.
  - You are about to alter the column `telefono` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
  - You are about to alter the column `email` on the `Proveedor` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to drop the column `apellido` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `apellidos` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombres` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categoria" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "descripcion" DROP NOT NULL,
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Cliente" ALTER COLUMN "cedula" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "nombres" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "apellidos" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "telefono" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(300);

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "descripcion" DROP NOT NULL,
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "imagen_url" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Proveedor" ALTER COLUMN "nombre" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "descripcion" DROP NOT NULL,
ALTER COLUMN "descripcion" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "direccion" DROP NOT NULL,
ALTER COLUMN "direccion" SET DATA TYPE VARCHAR(300),
ALTER COLUMN "telefono" DROP NOT NULL,
ALTER COLUMN "telefono" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);

-- AlterTable
-- Renombrar columnas conservando los datos
ALTER TABLE "Usuario"
RENAME COLUMN "nombre" TO "nombres";

ALTER TABLE "Usuario"
RENAME COLUMN "apellido" TO "apellidos";

-- Ajustar el tamaño
ALTER TABLE "Usuario"
ALTER COLUMN "nombres" TYPE VARCHAR(100),
ALTER COLUMN "apellidos" TYPE VARCHAR(100);