/*
  Warnings:

  - Added the required column `projectId` to the `MessageEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MessageEvent` ADD COLUMN `projectId` VARCHAR(191) NOT NULL,
    MODIFY `segmentId` VARCHAR(100) NULL,
    MODIFY `segmentTitle` VARCHAR(100) NULL;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Account_projectId_key`(`projectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMessageEvent` (
    `id` VARCHAR(191) NOT NULL,
    `lineId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `userNumber` VARCHAR(191) NULL,
    `email` VARCHAR(256) NULL,
    `readAt` TIMESTAMP(0) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `messageEventId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMessageLink` (
    `id` VARCHAR(191) NOT NULL,
    `originalLink` TEXT NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `userMessageEventId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMessageLinkActivity` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `content` JSON NULL,
    `orderId` VARCHAR(191) NULL,
    `orderNumber` VARCHAR(191) NULL,
    `orderTotal` VARCHAR(191) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `userMessageLinkId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MessageEvent` ADD CONSTRAINT `MessageEvent_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Account`(`projectId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMessageEvent` ADD CONSTRAINT `UserMessageEvent_messageEventId_fkey` FOREIGN KEY (`messageEventId`) REFERENCES `MessageEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMessageLink` ADD CONSTRAINT `UserMessageLink_userMessageEventId_fkey` FOREIGN KEY (`userMessageEventId`) REFERENCES `UserMessageEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMessageLinkActivity` ADD CONSTRAINT `UserMessageLinkActivity_userMessageLinkId_fkey` FOREIGN KEY (`userMessageLinkId`) REFERENCES `UserMessageLink`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
