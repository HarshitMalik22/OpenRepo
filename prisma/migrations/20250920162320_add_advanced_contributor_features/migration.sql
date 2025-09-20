/*
  Warnings:

  - A unique constraint covering the columns `[githubUsername]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."repositories" ADD COLUMN     "busFactor" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "codeQualityScore" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
ADD COLUMN     "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
ADD COLUMN     "healthScore" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "issueResolutionRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "lastCommitDate" TIMESTAMP(3),
ADD COLUMN     "maintainerActivityScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "maintainerResponseTime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "prMergeRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "testCoverage" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "public"."user_profiles" ADD COLUMN     "avoidedTech" TEXT[],
ADD COLUMN     "communicationStyle" TEXT NOT NULL DEFAULT 'collaborative',
ADD COLUMN     "learningStyle" TEXT NOT NULL DEFAULT 'hands-on',
ADD COLUMN     "preferredDifficulty" TEXT NOT NULL DEFAULT 'medium',
ADD COLUMN     "preferredTech" TEXT[],
ADD COLUMN     "timeCommitment" TEXT NOT NULL DEFAULT '5hrs';

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "availability" TEXT NOT NULL DEFAULT 'sporadic',
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "contributorScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "experienceLevel" TEXT NOT NULL DEFAULT 'intermediate',
ADD COLUMN     "followersCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "followingCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "githubUsername" TEXT,
ADD COLUMN     "isAvailableForHire" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMentor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastGitHubSync" TIMESTAMP(3),
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "openSourceExperience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "publicReposCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalContributions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalStarsReceived" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "twitterUsername" TEXT,
ADD COLUMN     "website" TEXT;

-- CreateTable
CREATE TABLE "public"."good_first_issues" (
    "id" TEXT NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "issueNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "state" TEXT NOT NULL DEFAULT 'open',
    "labels" TEXT[],
    "estimatedTime" TEXT NOT NULL DEFAULT '2hrs',
    "requiredSkills" TEXT[],
    "mentorAvailable" BOOLEAN NOT NULL DEFAULT false,
    "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "difficulty" TEXT NOT NULL DEFAULT 'beginner',
    "type" TEXT NOT NULL DEFAULT 'bug-fix',
    "language" TEXT,
    "assignee" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "good_first_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contribution_opportunities" (
    "id" TEXT NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "estimatedTime" TEXT NOT NULL,
    "requiredSkills" TEXT[],
    "impactLevel" TEXT NOT NULL,
    "skillMatch" DOUBLE PRECISION NOT NULL,
    "mentorAvailable" BOOLEAN NOT NULL DEFAULT false,
    "firstTimerFriendly" BOOLEAN NOT NULL DEFAULT false,
    "urgency" TEXT NOT NULL DEFAULT 'low',
    "status" TEXT NOT NULL DEFAULT 'available',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "contribution_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."technical_skills" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "proficiency" DOUBLE PRECISION NOT NULL,
    "yearsOfExperience" INTEGER NOT NULL DEFAULT 0,
    "lastUsed" TIMESTAMP(3),
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technical_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."learning_goals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "targetLevel" DOUBLE PRECISION NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "deadline" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contributions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "contributionType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "prNumber" INTEGER,
    "issueNumber" INTEGER,
    "status" TEXT NOT NULL,
    "estimatedTime" TEXT,
    "actualTime" TEXT,
    "skillsUsed" TEXT[],
    "skillsLearned" TEXT[],
    "impactScore" DOUBLE PRECISION NOT NULL,
    "visibilityBoost" DOUBLE PRECISION NOT NULL,
    "learningValue" DOUBLE PRECISION NOT NULL,
    "networkingValue" DOUBLE PRECISION NOT NULL,
    "mentorshipValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contributor_portfolios" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalContributions" INTEGER NOT NULL DEFAULT 0,
    "totalRepositories" INTEGER NOT NULL DEFAULT 0,
    "totalStarsReceived" INTEGER NOT NULL DEFAULT 0,
    "totalIssuesClosed" INTEGER NOT NULL DEFAULT 0,
    "totalPRsMerged" INTEGER NOT NULL DEFAULT 0,
    "averageImpactScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "topSkills" TEXT[],
    "favoriteLanguages" TEXT[],
    "contributionsByType" JSONB NOT NULL,
    "skillsAcquired" TEXT[],
    "testimonials" JSONB NOT NULL,
    "impactMetrics" JSONB NOT NULL,
    "achievements" TEXT[],
    "portfolioUrl" TEXT,
    "resumeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contributor_portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."impact_analyses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "contributionId" TEXT NOT NULL,
    "visibilityBoost" DOUBLE PRECISION NOT NULL,
    "learningValue" DOUBLE PRECISION NOT NULL,
    "networkingValue" DOUBLE PRECISION NOT NULL,
    "careerAdvancement" DOUBLE PRECISION NOT NULL,
    "communityImpact" DOUBLE PRECISION NOT NULL,
    "technicalImpact" DOUBLE PRECISION NOT NULL,
    "documentationImpact" DOUBLE PRECISION NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "analysisDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "impact_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "good_first_issues_repoFullName_issueNumber_key" ON "public"."good_first_issues"("repoFullName", "issueNumber");

-- CreateIndex
CREATE UNIQUE INDEX "technical_skills_userId_skillName_key" ON "public"."technical_skills"("userId", "skillName");

-- CreateIndex
CREATE UNIQUE INDEX "contributor_portfolios_userId_key" ON "public"."contributor_portfolios"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_githubUsername_key" ON "public"."users"("githubUsername");

-- AddForeignKey
ALTER TABLE "public"."good_first_issues" ADD CONSTRAINT "good_first_issues_repoFullName_fkey" FOREIGN KEY ("repoFullName") REFERENCES "public"."repositories"("fullName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contribution_opportunities" ADD CONSTRAINT "contribution_opportunities_repoFullName_fkey" FOREIGN KEY ("repoFullName") REFERENCES "public"."repositories"("fullName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."technical_skills" ADD CONSTRAINT "technical_skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."learning_goals" ADD CONSTRAINT "learning_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contributions" ADD CONSTRAINT "contributions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."contributor_portfolios" ADD CONSTRAINT "contributor_portfolios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."impact_analyses" ADD CONSTRAINT "impact_analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
