/*
  Warnings:

  - Made the column `content` on table `MessageEvent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `MessageEvent` MODIFY `content` JSON NOT NULL;
