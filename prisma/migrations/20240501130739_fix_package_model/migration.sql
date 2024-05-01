/*
  Warnings:

  - You are about to drop the column `status` on the `packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "packages" DROP COLUMN "status",
ADD COLUMN     "returned_at" TIMESTAMP(3);

-- DropEnum
DROP TYPE "PackageStatus";
