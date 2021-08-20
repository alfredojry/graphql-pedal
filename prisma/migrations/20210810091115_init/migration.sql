/*
  Warnings:

  - A unique constraint covering the columns `[ride_id,user_id]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription.ride_id_user_id_unique" ON "Subscription"("ride_id", "user_id");
