/*
  Warnings:

  - You are about to drop the column `isActive` on the `Survey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "isActive",
ADD COLUMN     "deadline" TIMESTAMP(3);
