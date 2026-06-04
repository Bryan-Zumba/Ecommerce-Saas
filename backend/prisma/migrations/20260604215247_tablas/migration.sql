/*
  Warnings:

  - Added the required column `id_periodo_contable` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_periodo_contable` to the `Turno_caja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_periodo_contable` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Tipo_gasto_operativo" AS ENUM ('Servicios', 'Transporte', 'Mantenimiento', 'Limpieza', 'Arriendo', 'Otros');

-- CreateEnum
CREATE TYPE "Estado_periodo_contable" AS ENUM ('Abierto', 'Cerrado');

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "direccion" VARCHAR,
ADD COLUMN     "estado" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "id_periodo_contable" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Movimiento_Inventario" ADD COLUMN     "id_compra" INTEGER,
ADD COLUMN     "id_venta" INTEGER;

-- AlterTable
ALTER TABLE "Movimiento_caja" ADD COLUMN     "id_gasto_operativo" INTEGER;

-- AlterTable
ALTER TABLE "Turno_caja" ADD COLUMN     "id_periodo_contable" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "must_change_password" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Venta" ADD COLUMN     "id_periodo_contable" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Acceso_Autorizado" (
    "id_acceso_autorizado" SERIAL NOT NULL,
    "email" VARCHAR NOT NULL,
    "codigo_acceso" VARCHAR NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_uso" TIMESTAMPTZ(6),
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Acceso_Autorizado_pkey" PRIMARY KEY ("id_acceso_autorizado")
);

-- CreateTable
CREATE TABLE "Gasto_operativo" (
    "id_gasto_operativo" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_periodo_contable" INTEGER NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "tipo_gasto" "Tipo_gasto_operativo" NOT NULL,
    "fecha_gasto" TIMESTAMPTZ(6) NOT NULL,
    "fecha_registro" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gasto_operativo_pkey" PRIMARY KEY ("id_gasto_operativo")
);

-- CreateTable
CREATE TABLE "Periodo_Contable" (
    "id_periodo_contable" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMPTZ(6) NOT NULL,
    "fecha_fin" TIMESTAMPTZ(6),
    "estado" "Estado_periodo_contable" NOT NULL DEFAULT 'Abierto',
    "total_ingresos" DECIMAL(10,2) NOT NULL,
    "total_egresos" DECIMAL(10,2) NOT NULL,
    "utilidad" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Periodo_Contable_pkey" PRIMARY KEY ("id_periodo_contable")
);

-- CreateTable
CREATE TABLE "Cierre_Periodo" (
    "id_cierre_periodo" SERIAL NOT NULL,
    "id_periodo_contable" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_cierre" TIMESTAMPTZ(6) NOT NULL,
    "total_ingresos" DECIMAL(10,2) NOT NULL,
    "total_egresos" DECIMAL(10,2) NOT NULL,
    "utilidad" DECIMAL(10,2) NOT NULL,
    "observacion" VARCHAR,

    CONSTRAINT "Cierre_Periodo_pkey" PRIMARY KEY ("id_cierre_periodo")
);

-- CreateIndex
CREATE UNIQUE INDEX "Acceso_Autorizado_email_key" ON "Acceso_Autorizado"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Acceso_Autorizado_codigo_acceso_key" ON "Acceso_Autorizado"("codigo_acceso");

-- AddForeignKey
ALTER TABLE "Turno_caja" ADD CONSTRAINT "Turno_caja_id_periodo_contable_fkey" FOREIGN KEY ("id_periodo_contable") REFERENCES "Periodo_Contable"("id_periodo_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_caja" ADD CONSTRAINT "Movimiento_caja_id_gasto_operativo_fkey" FOREIGN KEY ("id_gasto_operativo") REFERENCES "Gasto_operativo"("id_gasto_operativo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta" ADD CONSTRAINT "Venta_id_periodo_contable_fkey" FOREIGN KEY ("id_periodo_contable") REFERENCES "Periodo_Contable"("id_periodo_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_Inventario" ADD CONSTRAINT "Movimiento_Inventario_id_venta_fkey" FOREIGN KEY ("id_venta") REFERENCES "Venta"("id_venta") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimiento_Inventario" ADD CONSTRAINT "Movimiento_Inventario_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "Compra"("id_compra") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_id_periodo_contable_fkey" FOREIGN KEY ("id_periodo_contable") REFERENCES "Periodo_Contable"("id_periodo_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto_operativo" ADD CONSTRAINT "Gasto_operativo_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto_operativo" ADD CONSTRAINT "Gasto_operativo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto_operativo" ADD CONSTRAINT "Gasto_operativo_id_periodo_contable_fkey" FOREIGN KEY ("id_periodo_contable") REFERENCES "Periodo_Contable"("id_periodo_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Periodo_Contable" ADD CONSTRAINT "Periodo_Contable_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cierre_Periodo" ADD CONSTRAINT "Cierre_Periodo_id_periodo_contable_fkey" FOREIGN KEY ("id_periodo_contable") REFERENCES "Periodo_Contable"("id_periodo_contable") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cierre_Periodo" ADD CONSTRAINT "Cierre_Periodo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
