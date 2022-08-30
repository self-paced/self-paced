-- AlterTable
ALTER TABLE `UserMessageEvent` ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `status` VARCHAR(191) NULL DEFAULT 'success';
