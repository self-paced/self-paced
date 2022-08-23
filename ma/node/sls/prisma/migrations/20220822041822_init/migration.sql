/*
  Warnings:

  - Added the required column `segument_title` to the `MessageEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MessageEvent` ADD COLUMN `segument_title` VARCHAR(100) NOT NULL after title;
