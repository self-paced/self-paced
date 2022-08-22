/*
  Warnings:

  - You are about to alter the column `title` on the `MessageEvent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `MessageEvent` MODIFY `title` VARCHAR(100) NOT NULL;
