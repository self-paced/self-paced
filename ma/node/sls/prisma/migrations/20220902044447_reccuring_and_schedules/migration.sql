/*
  Warnings:

  - A unique constraint covering the columns `[messageScheduleId]` on the table `MessageEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messageScheduleId` to the `MessageEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MessageEvent` ADD COLUMN `messageScheduleId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `MessageReccuring` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `content` JSON NOT NULL,
    `deliveryCycle` VARCHAR(191) NOT NULL,
    `nextDeliveryAt` DATETIME(3) NOT NULL,
    `startDeliveryTerm` DATETIME(3) NULL,
    `endDeliveryTerm` DATETIME(3) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `projectId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MessageSchedule` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `content` JSON NOT NULL,
    `segmentId` VARCHAR(191) NULL,
    `segmentTitle` VARCHAR(191) NULL,
    `deliveryScheduleAt` DATETIME(3) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `projectId` VARCHAR(191) NOT NULL,
    `messageReccuringId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `MessageEvent_messageScheduleId_key` ON `MessageEvent`(`messageScheduleId`);

-- AddForeignKey
ALTER TABLE `MessageReccuring` ADD CONSTRAINT `MessageReccuring_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Account`(`projectId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MessageSchedule` ADD CONSTRAINT `MessageSchedule_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Account`(`projectId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MessageSchedule` ADD CONSTRAINT `MessageSchedule_messageReccuringId_fkey` FOREIGN KEY (`messageReccuringId`) REFERENCES `MessageReccuring`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MessageEvent` ADD CONSTRAINT `MessageEvent_messageScheduleId_fkey` FOREIGN KEY (`messageScheduleId`) REFERENCES `MessageSchedule`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
