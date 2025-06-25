-- CreateEnum
CREATE TYPE "TableAvailabilities" AS ENUM ('Available', 'Occupied');

-- CreateEnum
CREATE TYPE "TableSeats" AS ENUM ('2', '4', '6');

-- CreateTable
CREATE TABLE "MenuCategory" (
    "menuCategoryId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("menuCategoryId")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "menuItemId" SERIAL NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "menuCategoryId" INTEGER NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("menuItemId")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderNumber" SERIAL NOT NULL,
    "received" INTEGER,
    "tableNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderNumber")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "quantity" INTEGER NOT NULL,
    "orderNumber" SERIAL NOT NULL,
    "menuItemId" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("menuItemId","orderNumber")
);

-- CreateTable
CREATE TABLE "Table" (
    "tableNumber" SERIAL NOT NULL,
    "tableSeats" "TableSeats" NOT NULL,
    "tableAvailability" "TableAvailabilities" NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("tableNumber")
);

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_menuCategoryId_fkey" FOREIGN KEY ("menuCategoryId") REFERENCES "MenuCategory"("menuCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tableNumber_fkey" FOREIGN KEY ("tableNumber") REFERENCES "Table"("tableNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("menuItemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderNumber_fkey" FOREIGN KEY ("orderNumber") REFERENCES "Order"("orderNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

