-- CreateTable
CREATE TABLE "Rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "apellido" VARCHAR NOT NULL,
    "telefono" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password_hash" VARCHAR NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_acceso" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Rol_usuario" (
    "id_rol_usuario" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "Rol_usuario_pkey" PRIMARY KEY ("id_rol_usuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Rol_usuario" ADD CONSTRAINT "Rol_usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rol_usuario" ADD CONSTRAINT "Rol_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
