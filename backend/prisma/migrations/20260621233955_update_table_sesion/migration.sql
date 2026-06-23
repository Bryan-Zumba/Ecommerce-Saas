/*
  Warnings:

  - You are about to alter the column `ip` on the `Sesion` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(45)`.
  - A unique constraint covering the columns `[token]` on the table `Sesion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Sesion" ADD COLUMN     "revoked_at" TIMESTAMPTZ(6),
ADD COLUMN     "user_agent" TEXT,
ALTER COLUMN "token" SET DATA TYPE TEXT,
ALTER COLUMN "ip" DROP NOT NULL,
ALTER COLUMN "ip" SET DATA TYPE VARCHAR(45);

-- CreateIndex
CREATE UNIQUE INDEX "Sesion_token_key" ON "Sesion"("token");
