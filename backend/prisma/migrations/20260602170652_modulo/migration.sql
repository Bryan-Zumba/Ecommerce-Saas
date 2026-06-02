-- CreateTable
CREATE TABLE "Sesion" (
    "id_sesion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "token" VARCHAR NOT NULL,
    "ip" VARCHAR NOT NULL,
    "fecha_inicio" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_expiracion" TIMESTAMPTZ(6) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Sesion_pkey" PRIMARY KEY ("id_sesion")
);

-- AddForeignKey
ALTER TABLE "Sesion" ADD CONSTRAINT "Sesion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
