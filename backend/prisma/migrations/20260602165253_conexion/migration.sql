-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;
