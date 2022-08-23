/*
  Warnings:

  - Added the required column `segment_id` to the `MessageEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MessageEvent` ADD COLUMN `segment_id` VARCHAR(100) NOT NULL after id;
