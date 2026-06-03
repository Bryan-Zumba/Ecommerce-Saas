-- DropForeignKey
ALTER TABLE "Detalle_Venta" DROP CONSTRAINT "Detalle_Venta_id_bodega_fkey";

-- AlterTable
ALTER TABLE "Detalle_Venta" ALTER COLUMN "id_bodega" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Detalle_Venta" ADD CONSTRAINT "Detalle_Venta_id_bodega_fkey" FOREIGN KEY ("id_bodega") REFERENCES "Bodega"("id_bodega") ON DELETE SET NULL ON UPDATE CASCADE;
