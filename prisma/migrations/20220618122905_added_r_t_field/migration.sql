/*
  Warnings:

  - Added the required column `r_t` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "r_t" TEXT NOT NULL;
