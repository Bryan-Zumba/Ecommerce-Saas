-- CreateEnum
CREATE TYPE "Tipo_Item" AS ENUM ('Producto', 'Servicio');

-- CreateTable
CREATE TABLE "Cliente" (
    "id_cliente" SERIAL NOT NULL,
    "cedula" VARCHAR NOT NULL,
    "nombres" VARCHAR NOT NULL,
    "apellidos" VARCHAR NOT NULL,
    "email" VARCHAR,
    "telefono" VARCHAR,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id_empresa" SERIAL NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "ruc" VARCHAR NOT NULL,
    "direccion" VARCHAR NOT NULL,
    "telefono" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "logo_url" VARCHAR NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "Item" (
    "id_item" SERIAL NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "tipo" "Tipo_Item" NOT NULL,
    "imagen_url" VARCHAR NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id_item")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cedula_key" ON "Cliente"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_ruc_key" ON "Empresa"("ruc");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;
