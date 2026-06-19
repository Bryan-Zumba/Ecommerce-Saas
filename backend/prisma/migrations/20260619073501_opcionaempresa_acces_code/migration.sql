-- DropForeignKey
ALTER TABLE "Acceso_Autorizado" DROP CONSTRAINT "Acceso_Autorizado_id_empresa_fkey";

-- AlterTable
ALTER TABLE "Acceso_Autorizado" ALTER COLUMN "id_empresa" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Acceso_Autorizado" ADD CONSTRAINT "Acceso_Autorizado_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE SET NULL ON UPDATE CASCADE;
