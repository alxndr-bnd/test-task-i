-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "isFree" BOOLEAN NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "hasPractice" BOOLEAN NOT NULL,
    "hasCertificate" BOOLEAN NOT NULL,
    "isAccredited" BOOLEAN NOT NULL,
    "isEditorsChoice" BOOLEAN NOT NULL,
    "isSponsored" BOOLEAN NOT NULL,
    "promoStart" DATETIME,
    "promoEnd" DATETIME,
    "ratingAvg" REAL NOT NULL,
    "ratingCount" INTEGER NOT NULL,
    "enrollments" INTEGER NOT NULL,
    "lastUpdatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qualityWeight" REAL NOT NULL,
    "popularityWeight" REAL NOT NULL,
    "freshnessWeight" REAL NOT NULL,
    "editorialWeight" REAL NOT NULL,
    "qualityFloor" REAL NOT NULL,
    "promotionCap" INTEGER NOT NULL,
    "sponsoredBoost" REAL NOT NULL,
    "editorsChoiceBoost" REAL NOT NULL,
    "minRatingsForConfidence" INTEGER NOT NULL,
    "freshnessMaxAgeDays" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
