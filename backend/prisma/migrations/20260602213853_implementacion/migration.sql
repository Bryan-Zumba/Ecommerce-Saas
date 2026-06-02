/*
  Warnings:

  - You are about to drop the column `estado` on the `Empresa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cedula,id_empresa]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_item,id_bodega]` on the table `Inventario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_usuario,id_rol]` on the table `Rol_usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_empresa` to the `Categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_empresa` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costo` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tipo_movimiento` on the `Movimiento_Inventario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Tipo_Movimiento_caja" AS ENUM ('Ingreso', 'Egreso', 'Apertura', 'Cierre');

-- CreateEnum
CREATE TYPE "Estado_venta" AS ENUM ('Pendiente', 'Completada', 'Cancelada');

-- CreateEnum
CREATE TYPE "Tipo_movimiento_inventario" AS ENUM ('Compra', 'Venta', 'Devolucion');

-- CreateEnum
CREATE TYPE "Estado_compra" AS ENUM ('Pendiente', 'Completada', 'Cancelada');

-- DropIndex
DROP INDEX "Cliente_cedula_key";

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "id_empresa" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "id_empresa" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Empresa" DROP COLUMN "estado",
ADD COLUMN     "estado_empresa" "Estado_empresa" NOT NULL DEFAULT 'Activo';

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "costo" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "imagen_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Movimiento_Inventario" DROP COLUMN "tipo_movimiento",
ADD COLUMN     "tipo_movimiento" "Tipo_movimiento_inventario" NOT NULL;

-- CreateTable
CREATE TABLE "Caja" (
    "id_caja" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Caja_pkey" PRIMARY KEY ("id_caja")
);

-- CreateTable
CREATE TABLE "Periodo_Gestion" (
    "id_periodo_gestion" SERIAL NOT NULL,
    "fecha_inicio" TIMESTAMPTZ(6) NOT NULL,
    "fecha_fin" TIMESTAMPTZ(6) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT false,
    "observacion" VARCHAR,

    CONSTRAINT "Periodo_Gestion_pkey" PRIMARY KEY ("id_periodo_gestion")
);

-- CreateTable
CREATE TABLE "Turno_caja" (
    "id_turno_caja" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_periodo_gestion" INTEGER NOT NULL,
    "id_caja" INTEGER NOT NULL,
    "fecha_apertura" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" TIMESTAMPTZ(6),
    "monto_apertura" DECIMAL(10,2) NOT NULL,
    "monto_cierre" DECIMAL(10,2),
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Turno_caja_pkey" PRIMARY KEY ("id_turno_caja")
);

-- CreateTable
CREATE TABLE "Movimiento_caja" (
    "id_movimiento_caja" SERIAL NOT NULL,
    "id_turno_caja" INTEGER NOT NULL,
    "id_venta" INTEGER,
    "id_compra" INTEGER,
    "id_empresa" INTEGER NOT NULL,
    "tipo_movimiento" "Tipo_Movimiento_caja" NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "referencia" VARCHAR NOT NULL,
    "fecha_movimiento" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movimiento_caja_pkey" PRIMARY KEY ("id_movimiento_caja")
);

-- CreateTable
CREATE TABLE "Metodo_Pago" (
    "id_metodo_pago" SERIAL NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Metodo_Pago_pkey" PRIMARY KEY ("id_metodo_pago")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id_pago" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "id_metodo_pago" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "fecha_pago" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "Venta" (
    "id_venta" SERIAL NOT NULL,
    "id_turno_caja" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "observacion" VARCHAR,
    "fecha" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado_venta" "Estado_venta" NOT NULL DEFAULT 'Pendiente',

    CONSTRAINT "Venta_pkey" PRIMARY KEY ("id_venta")
);

-- CreateTable
CREATE TABLE "Detalle_Venta" (
    "id_detalle_venta" SERIAL NOT NULL,
    "id_venta" INTEGER NOT NULL,
    "id_item" INTEGER NOT NULL,
    "id_bodega" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Detalle_Venta_pkey" PRIMARY KEY ("id_detalle_venta")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id_proveedor" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "direccion" VARCHAR NOT NULL,
    "telefono" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "fecha_registro" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id_compra" SERIAL NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "fecha_compra" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacion" VARCHAR NOT NULL,
    "estado_compra" "Estado_compra" NOT NULL DEFAULT 'Pendiente',

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id_compra")
);

-- CreateTable
CREATE TABLE "Detalle_Compra" (
    "id_detalle_compra" SERIAL NOT NULL,
    "id_compra" INTEGER NOT NULL,
    "id_bodega" INTEGER NOT NULL,
    "id_item" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "costo_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Detalle_Compra_pkey" PRIMARY KEY ("id_detalle_compra")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cedula_id_empresa_key" ON "Cliente"("cedula", "id_empresa");

-- CreateIndex
CREATE UNIQUE INDEX "Inventario_id_item_id_bodega_key" ON "Inventario"("id_item", "id_bodega");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_usuario_id_usuario_id_rol_key" ON "Rol_usuario"("id_usuario", "id_rol");

-- AddForeignKey
ALTER TABLE "Caja" ADD CONSTRAINT "Caja_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno_caja" ADD CONSTRAINT "Turno_caja_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno_caja" ADD CONSTRAINT "Turno_caja_id_periodo_gestion_fkey" FOREIGN KEY ("id_periodo_gestion") REFERENCES "Periodo_Gestion"("id_periodo_gestion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno_caja" ADD CONSTRAINT "Turno_caja_id_caja_fkey" FOREIGN KEY ("id_caja") REFERENCES "Caja"("id_caja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_caja" ADD CONSTRAINT "Movimiento_caja_id_turno_caja_fkey" FOREIGN KEY ("id_turno_caja") REFERENCES "Turno_caja"("id_turno_caja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_caja" ADD CONSTRAINT "Movimiento_caja_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "Venta"("id_venta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_caja" ADD CONSTRAINT "Movimiento_caja_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "Compra"("id_compra") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_caja" ADD CONSTRAINT "Movimiento_caja_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "Venta"("id_venta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_id_metodo_pago_fkey" FOREIGN KEY ("id_metodo_pago") REFERENCES "Metodo_Pago"("id_metodo_pago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_id_turno_caja_fkey" FOREIGN KEY ("id_turno_caja") REFERENCES "Turno_caja"("id_turno_caja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Venta" ADD CONSTRAINT "Detalle_Venta_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "Venta"("id_venta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Venta" ADD CONSTRAINT "Detalle_Venta_id_item_fkey" FOREIGN KEY ("id_item") REFERENCES "Item"("id_item") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Venta" ADD CONSTRAINT "Detalle_Venta_id_bodega_fkey" FOREIGN KEY ("id_bodega") REFERENCES "Bodega"("id_bodega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bodega" ADD CONSTRAINT "Bodega_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proveedor" ADD CONSTRAINT "Proveedor_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedor"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Compra" ADD CONSTRAINT "Detalle_Compra_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "Compra"("id_compra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Compra" ADD CONSTRAINT "Detalle_Compra_id_item_fkey" FOREIGN KEY ("id_item") REFERENCES "Item"("id_item") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Detalle_Compra" ADD CONSTRAINT "Detalle_Compra_id_bodega_fkey" FOREIGN KEY ("id_bodega") REFERENCES "Bodega"("id_bodega") ON DELETE RESTRICT ON UPDATE CASCADE;
