/*
  Warnings:

  - You are about to drop the column `dummy` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "dummy",
ADD COLUMN     "subscription_date" TIMESTAMP(3);
