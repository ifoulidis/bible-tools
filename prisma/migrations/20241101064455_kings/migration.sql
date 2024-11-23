-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "lengthOfReign" TEXT NOT NULL,
    "startOfReign" INTEGER NOT NULL,
    "endOfReign" INTEGER NOT NULL,
    "relationToPredecessor" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BiblePassage" (
    "id" SERIAL NOT NULL,
    "book" TEXT NOT NULL,
    "chapter" TEXT NOT NULL,
    "verses" TEXT NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "BiblePassage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BiblePassage" ADD CONSTRAINT "BiblePassage_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
