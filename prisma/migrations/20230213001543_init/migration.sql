-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chartIndex" INTEGER NOT NULL,
    "difficultyId" INTEGER NOT NULL,
    "songId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "score" INTEGER NOT NULL,
    "flags" TEXT NOT NULL,
    "perfect1" TEXT NOT NULL,
    "perfect2" TEXT NOT NULL,
    "early" TEXT NOT NULL,
    "green" TEXT NOT NULL,
    "yellow" TEXT NOT NULL,
    "red" TEXT NOT NULL,
    "late" TEXT NOT NULL,
    "misses" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Score_chartIndex_songId_fkey" FOREIGN KEY ("chartIndex", "songId") REFERENCES "Chart" ("diffIndex", "songId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Score_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("remoteId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "jacket" TEXT NOT NULL,
    "bpm" TEXT NOT NULL,
    "genre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Chart" (
    "diffIndex" INTEGER NOT NULL,
    "songId" TEXT NOT NULL,
    "diffLevel" INTEGER NOT NULL,

    PRIMARY KEY ("songId", "diffIndex"),
    CONSTRAINT "Chart_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "remoteId" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
