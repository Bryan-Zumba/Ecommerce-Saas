/*
  Warnings:

  - You are about to drop the column `tipo` on the `Item` table. All the data in the column will be lost.
  - Added the required column `tipo_item` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "tipo",
ADD COLUMN     "tipo_item" "Tipo_Item" NOT NULL;
