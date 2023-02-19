/*
  Warnings:

  - The primary key for the `Rating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Rating` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rating" (
    "itemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    CONSTRAINT "Rating_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rating" ("itemId", "userId", "value") SELECT "itemId", "userId", "value" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
CREATE UNIQUE INDEX "Rating_itemId_userId_key" ON "Rating"("itemId", "userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
