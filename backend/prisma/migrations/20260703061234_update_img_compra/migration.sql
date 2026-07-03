/*
  Warnings:

  - Added the required column `codigo_factura` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagen_public_id` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagen_url` to the `Compra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "codigo_factura" VARCHAR(50) NOT NULL,
ADD COLUMN     "imagen_public_id" VARCHAR(500) NOT NULL,
ADD COLUMN     "imagen_url" VARCHAR(500) NOT NULL;
