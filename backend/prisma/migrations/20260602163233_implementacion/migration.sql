/*
  Warnings:

  - The `estado` column on the `Empresa` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Estado_empresa" AS ENUM ('Activo', 'Inactivo', 'Suspendido');

-- AlterTable
ALTER TABLE "Empresa" DROP COLUMN "estado",
ADD COLUMN     "estado" "Estado_empresa" NOT NULL DEFAULT 'Activo';

-- CreateTable
CREATE TABLE "Bodega" (
    "id_bodega" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "ubicacion" VARCHAR NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "fecha_registro" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bodega_pkey" PRIMARY KEY ("id_bodega")
);

-- CreateTable
CREATE TABLE "Inventario" (
    "id_inventario" SERIAL NOT NULL,
    "id_item" INTEGER NOT NULL,
    "id_bodega" INTEGER NOT NULL,
    "stock_actual" INTEGER NOT NULL DEFAULT 0,
    "stock_disponible" INTEGER NOT NULL DEFAULT 0,
    "stock_reservado" INTEGER NOT NULL DEFAULT 0,
    "fecha_ultima_actualizacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id_inventario")
);

-- CreateTable
CREATE TABLE "Movimiento_Inventario" (
    "id_movimiento_inventario" SERIAL NOT NULL,
    "id_item" INTEGER NOT NULL,
    "id_bodega" INTEGER NOT NULL,
    "tipo_movimiento" VARCHAR NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "stock_anterior" INTEGER NOT NULL DEFAULT 0,
    "stock_nuevo" INTEGER NOT NULL DEFAULT 0,
    "fecha_movimiento" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movimiento_Inventario_pkey" PRIMARY KEY ("id_movimiento_inventario")
);

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_id_item_fkey" FOREIGN KEY ("id_item") REFERENCES "Item"("id_item") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "Inventario_id_bodega_fkey" FOREIGN KEY ("id_bodega") REFERENCES "Bodega"("id_bodega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_Inventario" ADD CONSTRAINT "Movimiento_Inventario_id_bodega_fkey" FOREIGN KEY ("id_bodega") REFERENCES "Bodega"("id_bodega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_Inventario" ADD CONSTRAINT "Movimiento_Inventario_id_item_fkey" FOREIGN KEY ("id_item") REFERENCES "Item"("id_item") ON DELETE RESTRICT ON UPDATE CASCADE;
