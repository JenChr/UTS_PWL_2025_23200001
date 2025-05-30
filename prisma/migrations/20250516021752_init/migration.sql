/*
  Warnings:

  - You are about to drop the `Package` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Package";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Pkg" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Pkg_kode_key" ON "Pkg"("kode");
