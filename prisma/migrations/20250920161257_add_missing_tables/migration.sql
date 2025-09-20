-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillLevel" TEXT NOT NULL DEFAULT 'beginner',
    "interests" TEXT[],
    "goals" TEXT[],
    "experience" JSONB,
    "learnedWeights" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_onboarding_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "techStack" TEXT[],
    "goal" TEXT NOT NULL DEFAULT 'learn',
    "experienceLevel" TEXT NOT NULL DEFAULT 'beginner',
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_onboarding_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."repositories" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,
    "issues" INTEGER NOT NULL DEFAULT 0,
    "contributors" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3),
    "topics" TEXT[],
    "techStack" TEXT[],
    "difficulty" TEXT NOT NULL DEFAULT 'beginner',
    "competition" TEXT NOT NULL DEFAULT 'low',
    "hasContributing" BOOLEAN NOT NULL DEFAULT false,
    "matchScore" DOUBLE PRECISION,
    "aiAnalysis" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_interactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repositoryFullName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "score" INTEGER,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_ml_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_ml_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."saved_repositories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "repoName" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT[],
    "notes" TEXT,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_analyses" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "repositoryFullName" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ai_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."repository_analyses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repoFullName" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "flowchartMermaid" TEXT NOT NULL,
    "explanation" JSONB NOT NULL,
    "resources" JSONB NOT NULL,
    "insights" JSONB,
    "analysisVersion" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repository_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."community_stats" (
    "id" TEXT NOT NULL,
    "totalQueries" INTEGER NOT NULL DEFAULT 0,
    "totalUsers" INTEGER NOT NULL DEFAULT 0,
    "activeRepositories" INTEGER NOT NULL DEFAULT 0,
    "successfulContributions" INTEGER NOT NULL DEFAULT 0,
    "averageSatisfaction" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."popular_repositories" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "forks" INTEGER NOT NULL DEFAULT 0,
    "openIssues" INTEGER NOT NULL DEFAULT 0,
    "topics" TEXT[],
    "competitionLevel" TEXT NOT NULL DEFAULT 'moderate',
    "activityLevel" TEXT NOT NULL DEFAULT 'moderate',
    "aiDomain" TEXT NOT NULL DEFAULT 'other',
    "difficultyLevel" TEXT NOT NULL DEFAULT 'intermediate',
    "difficultyScore" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "contributorCount" INTEGER NOT NULL DEFAULT 0,
    "recentCommits" INTEGER NOT NULL DEFAULT 0,
    "issueResponseRate" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "documentationScore" DOUBLE PRECISION NOT NULL DEFAULT 50.0,
    "lastFetched" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "popular_repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recommendation_cache" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "cacheKey" TEXT NOT NULL,
    "repositories" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommendation_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "public"."users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_userId_key" ON "public"."user_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_onboarding_preferences_userId_key" ON "public"."user_onboarding_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_fullName_key" ON "public"."repositories"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "user_ml_preferences_userId_category_key_key" ON "public"."user_ml_preferences"("userId", "category", "key");

-- CreateIndex
CREATE UNIQUE INDEX "saved_repositories_userId_repoFullName_key" ON "public"."saved_repositories"("userId", "repoFullName");

-- CreateIndex
CREATE UNIQUE INDEX "repository_analyses_userId_repoFullName_key" ON "public"."repository_analyses"("userId", "repoFullName");

-- CreateIndex
CREATE UNIQUE INDEX "popular_repositories_fullName_key" ON "public"."popular_repositories"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "recommendation_cache_cacheKey_key" ON "public"."recommendation_cache"("cacheKey");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "public"."system_config"("key");

-- AddForeignKey
ALTER TABLE "public"."user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_onboarding_preferences" ADD CONSTRAINT "user_onboarding_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_interactions" ADD CONSTRAINT "user_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_interactions" ADD CONSTRAINT "user_interactions_repositoryFullName_fkey" FOREIGN KEY ("repositoryFullName") REFERENCES "public"."repositories"("fullName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_ml_preferences" ADD CONSTRAINT "user_ml_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_repositories" ADD CONSTRAINT "saved_repositories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_repositories" ADD CONSTRAINT "saved_repositories_repoFullName_fkey" FOREIGN KEY ("repoFullName") REFERENCES "public"."repositories"("fullName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_analyses" ADD CONSTRAINT "ai_analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_analyses" ADD CONSTRAINT "ai_analyses_repositoryFullName_fkey" FOREIGN KEY ("repositoryFullName") REFERENCES "public"."repositories"("fullName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."repository_analyses" ADD CONSTRAINT "repository_analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
