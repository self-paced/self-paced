/*
  Warnings:

  - You are about to alter the column `orderTotal` on the `UserMessageLinkActivity` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `UserMessageEvent` ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NULL DEFAULT 'success';

-- AlterTable
ALTER TABLE `UserMessageLinkActivity` MODIFY `orderTotal` INTEGER NULL DEFAULT 0;
