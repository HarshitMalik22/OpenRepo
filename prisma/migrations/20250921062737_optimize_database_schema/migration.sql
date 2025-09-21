/*
  Warnings:

  - You are about to drop the column `aiAnalysis` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `busFactor` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `codeQualityScore` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `competition` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `contributors` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `documentationScore` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `forks` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `hasContributing` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `healthScore` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `issueResolutionRate` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `issues` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `lastCommitDate` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `lastUpdated` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `maintainerActivityScore` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `maintainerResponseTime` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `matchScore` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `prMergeRate` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `stars` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `techStack` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `testCoverage` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the column `topics` on the `repositories` table. All the data in the column will be lost.
  - You are about to drop the `contribution_opportunities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `good_first_issues` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ai_analyses" DROP CONSTRAINT "ai_analyses_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."contribution_opportunities" DROP CONSTRAINT "contribution_opportunities_repoFullName_fkey";

-- DropForeignKey
ALTER TABLE "public"."good_first_issues" DROP CONSTRAINT "good_first_issues_repoFullName_fkey";

-- AlterTable
ALTER TABLE "public"."repositories" DROP COLUMN "aiAnalysis",
DROP COLUMN "busFactor",
DROP COLUMN "codeQualityScore",
DROP COLUMN "competition",
DROP COLUMN "contributors",
DROP COLUMN "description",
DROP COLUMN "difficulty",
DROP COLUMN "documentationScore",
DROP COLUMN "forks",
DROP COLUMN "hasContributing",
DROP COLUMN "healthScore",
DROP COLUMN "isActive",
DROP COLUMN "issueResolutionRate",
DROP COLUMN "issues",
DROP COLUMN "language",
DROP COLUMN "lastCommitDate",
DROP COLUMN "lastUpdated",
DROP COLUMN "maintainerActivityScore",
DROP COLUMN "maintainerResponseTime",
DROP COLUMN "matchScore",
DROP COLUMN "prMergeRate",
DROP COLUMN "stars",
DROP COLUMN "techStack",
DROP COLUMN "testCoverage",
DROP COLUMN "topics";

-- AlterTable
ALTER TABLE "public"."user_interactions" ADD COLUMN     "duration_ms" INTEGER,
ADD COLUMN     "session_id" TEXT,
ADD COLUMN     "source_page" TEXT;

-- DropTable
DROP TABLE "public"."contribution_opportunities";

-- DropTable
DROP TABLE "public"."good_first_issues";

-- CreateTable
CREATE TABLE "public"."repository_references" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repository_references_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "repository_references_fullName_key" ON "public"."repository_references"("fullName");

-- AddForeignKey
ALTER TABLE "public"."ai_analyses" ADD CONSTRAINT "ai_analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
