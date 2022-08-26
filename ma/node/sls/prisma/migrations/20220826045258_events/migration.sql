-- CreateTable
CREATE TABLE `UserMessageEvent` (
    `id` VARCHAR(191) NOT NULL,
    `ecfId` INTEGER NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `isRead` BOOLEAN NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `messageEventId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMessageLink` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `userMessageEventId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserMessageLinkActivity` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `content` JSON NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `userMessageLinkId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserMessageEvent` ADD CONSTRAINT `UserMessageEvent_messageEventId_fkey` FOREIGN KEY (`messageEventId`) REFERENCES `MessageEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMessageLink` ADD CONSTRAINT `UserMessageLink_userMessageEventId_fkey` FOREIGN KEY (`userMessageEventId`) REFERENCES `UserMessageEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserMessageLinkActivity` ADD CONSTRAINT `UserMessageLinkActivity_userMessageLinkId_fkey` FOREIGN KEY (`userMessageLinkId`) REFERENCES `UserMessageLink`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
