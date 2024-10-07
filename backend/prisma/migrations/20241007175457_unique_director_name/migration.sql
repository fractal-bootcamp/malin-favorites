/*
  Warnings:

  - You are about to drop the column `authorId` on the `Movie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Director` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `directorId` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_authorId_fkey";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "authorId",
ADD COLUMN     "directorId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Director_name_key" ON "Director"("name");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "Director"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
