/*
  Warnings:

  - You are about to alter the column `order_by` on the `Preorder` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `selected_package` on the `Preorder` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Preorder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_date" DATETIME NOT NULL,
    "order_by" INTEGER NOT NULL,
    "selected_package" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "is_paid" BOOLEAN NOT NULL,
    CONSTRAINT "Preorder_selected_package_fkey" FOREIGN KEY ("selected_package") REFERENCES "Pkg" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Preorder_order_by_fkey" FOREIGN KEY ("order_by") REFERENCES "customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Preorder" ("id", "is_paid", "order_by", "order_date", "qty", "selected_package") SELECT "id", "is_paid", "order_by", "order_date", "qty", "selected_package" FROM "Preorder";
DROP TABLE "Preorder";
ALTER TABLE "new_Preorder" RENAME TO "Preorder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
