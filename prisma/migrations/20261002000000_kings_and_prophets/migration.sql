-- DropForeignKey
ALTER TABLE "BiblePassage" DROP CONSTRAINT "BiblePassage_characterId_fkey";

-- DropTable
DROP TABLE "Character";

-- DropTable
DROP TABLE "BiblePassage";

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "altNames" TEXT[],
    "summary" TEXT NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reign" (
    "personId" TEXT NOT NULL,
    "kingdom" TEXT NOT NULL,
    "predecessorId" TEXT,
    "successorId" TEXT,
    "relationToPredecessor" TEXT,

    CONSTRAINT "Reign_pkey" PRIMARY KEY ("personId")
);

-- CreateTable
CREATE TABLE "Ministry" (
    "personId" TEXT NOT NULL,
    "audience" TEXT[],
    "hasBook" BOOLEAN NOT NULL,

    CONSTRAINT "Ministry_pkey" PRIMARY KEY ("personId")
);

-- CreateTable
CREATE TABLE "Dating" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "label" TEXT,
    "spanFrom" INTEGER NOT NULL,
    "spanTo" INTEGER NOT NULL,
    "approx" BOOLEAN NOT NULL,
    "coregencyFrom" INTEGER,
    "confidence" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Dating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "datingId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "book" TEXT,
    "fromChapter" INTEGER,
    "fromVerse" INTEGER,
    "toChapter" INTEGER,
    "toVerse" INTEGER,
    "note" TEXT,
    "artifact" TEXT,
    "contemporaryIds" TEXT[],

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "publisher" TEXT,
    "url" TEXT,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL,
    "datingId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "pages" TEXT,

    CONSTRAINT "Citation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passage" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "book" TEXT NOT NULL,
    "fromChapter" INTEGER NOT NULL,
    "fromVerse" INTEGER,
    "toChapter" INTEGER,
    "toVerse" INTEGER,
    "kind" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "Passage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "relation" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relatedPersonId" TEXT,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dating_personId_role_position_key" ON "Dating"("personId", "role", "position");

-- AddForeignKey
ALTER TABLE "Reign" ADD CONSTRAINT "Reign_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ministry" ADD CONSTRAINT "Ministry_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dating" ADD CONSTRAINT "Dating_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_datingId_fkey" FOREIGN KEY ("datingId") REFERENCES "Dating"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_datingId_fkey" FOREIGN KEY ("datingId") REFERENCES "Dating"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passage" ADD CONSTRAINT "Passage_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

