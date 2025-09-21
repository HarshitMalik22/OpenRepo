-- =============================================
-- OpenSauce Supabase RLS Policies - OPTIMIZED VERSION
-- =============================================
-- This version fixes performance issues and policy conflicts
-- Uses (select auth.uid()) instead of auth.uid() for better performance
-- Removes redundant policies and conflicts

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ml_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE repository_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributor_portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE repository_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE _prisma_migrations ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to clean up conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view own user profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own user profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own user profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own onboarding preferences" ON user_onboarding_preferences;
DROP POLICY IF EXISTS "Users can update own onboarding preferences" ON user_onboarding_preferences;
DROP POLICY IF EXISTS "Users can insert own onboarding preferences" ON user_onboarding_preferences;
DROP POLICY IF EXISTS "Users can view own ML preferences" ON user_ml_preferences;
DROP POLICY IF EXISTS "Users can update own ML preferences" ON user_ml_preferences;
DROP POLICY IF EXISTS "Users can manage own ML preferences" ON user_ml_preferences;
DROP POLICY IF EXISTS "Users can view own technical skills" ON technical_skills;
DROP POLICY IF EXISTS "Users can manage own technical skills" ON technical_skills;
DROP POLICY IF EXISTS "Users can view own learning goals" ON learning_goals;
DROP POLICY IF EXISTS "Users can manage own learning goals" ON learning_goals;
DROP POLICY IF EXISTS "Users can view own saved repositories" ON saved_repositories;
DROP POLICY IF EXISTS "Users can manage own saved repositories" ON saved_repositories;
DROP POLICY IF EXISTS "Users can view own interactions" ON user_interactions;
DROP POLICY IF EXISTS "Users can create own interactions" ON user_interactions;
DROP POLICY IF EXISTS "Users can view own AI analyses" ON ai_analyses;
DROP POLICY IF EXISTS "Users can create own AI analyses" ON ai_analyses;
DROP POLICY IF EXISTS "Public can view anonymous AI analyses" ON ai_analyses;
DROP POLICY IF EXISTS "Users can view own repository analyses" ON repository_analyses;
DROP POLICY IF EXISTS "Users can create own repository analyses" ON repository_analyses;
DROP POLICY IF EXISTS "Users can update own repository analyses" ON repository_analyses;
DROP POLICY IF EXISTS "Everyone can view repositories" ON repositories;
DROP POLICY IF EXISTS "Public can read repositories" ON repositories;
DROP POLICY IF EXISTS "Authenticated users can create repositories" ON repositories;
DROP POLICY IF EXISTS "System can update repositories" ON repositories;
DROP POLICY IF EXISTS "Everyone can view popular repositories" ON popular_repositories;
DROP POLICY IF EXISTS "Public can read popular repositories" ON popular_repositories;
DROP POLICY IF EXISTS "System can manage popular repositories" ON popular_repositories;
DROP POLICY IF EXISTS "Users can view own cache entries" ON recommendation_cache;
DROP POLICY IF EXISTS "Users can create own cache entries" ON recommendation_cache;
DROP POLICY IF EXISTS "System can manage recommendation cache" ON recommendation_cache;
DROP POLICY IF EXISTS "Everyone can view community stats" ON community_stats;
DROP POLICY IF EXISTS "Public can read community stats" ON community_stats;
DROP POLICY IF EXISTS "System can manage community stats" ON community_stats;
DROP POLICY IF EXISTS "Users can view own contributions" ON contributions;
DROP POLICY IF EXISTS "Users can create own contributions" ON contributions;
DROP POLICY IF EXISTS "Users can update own contributions" ON contributions;
DROP POLICY IF EXISTS "Users can view own portfolio" ON contributor_portfolios;
DROP POLICY IF EXISTS "Users can update own portfolio" ON contributor_portfolios;
DROP POLICY IF EXISTS "Users can view own impact analyses" ON impact_analyses;
DROP POLICY IF EXISTS "Users can create own impact analyses" ON impact_analyses;
DROP POLICY IF EXISTS "Everyone can view repository references" ON repository_references;
DROP POLICY IF EXISTS "Admins can manage system config" ON system_config;
DROP POLICY IF EXISTS "No access to prisma migrations" ON _prisma_migrations;

-- Users table policies - OPTIMIZED
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING ((select auth.uid())::text = "clerkId");

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING ((select auth.uid())::text = "clerkId");

-- User Profiles table policies - OPTIMIZED
-- Users can view their own profile
CREATE POLICY "Users can view own user profile" ON user_profiles
    FOR SELECT USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = user_profiles."userId"));

-- Users can update their own profile
CREATE POLICY "Users can update own user profile" ON user_profiles
    FOR UPDATE USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = user_profiles."userId"));

-- Repositories table policies - OPTIMIZED
-- Everyone can view repositories (public data)
CREATE POLICY "Everyone can view repositories" ON repositories
    FOR SELECT USING (true);

-- User Onboarding Preferences table policies - OPTIMIZED
-- Users can view their own onboarding preferences
CREATE POLICY "Users can view own onboarding preferences" ON user_onboarding_preferences
    FOR SELECT USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = user_onboarding_preferences."userId"));

-- Users can update their own onboarding preferences
CREATE POLICY "Users can update own onboarding preferences" ON user_onboarding_preferences
    FOR UPDATE USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = user_onboarding_preferences."userId"));

-- User ML Preferences table policies - OPTIMIZED
-- Users can view their own ML preferences
CREATE POLICY "Users can view own ML preferences" ON user_ml_preferences
    FOR SELECT USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = user_ml_preferences."userId"));

-- Users can update their own ML preferences
CREATE POLICY "Users can update own ML preferences" ON user_ml_preferences
    FOR UPDATE USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = user_ml_preferences."userId"));

-- Technical Skills table policies - OPTIMIZED
-- Users can manage their own skills (includes SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Users can manage own technical skills" ON technical_skills
    FOR ALL USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = technical_skills."userId"));

-- Learning Goals table policies - OPTIMIZED
-- Users can manage their own learning goals (includes SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Users can manage own learning goals" ON learning_goals
    FOR ALL USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = learning_goals."userId"));

-- Saved Repositories table policies - OPTIMIZED
-- Users can manage their own saved repositories (includes SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Users can manage own saved repositories" ON saved_repositories
    FOR ALL USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = saved_repositories."userId"));

-- User Interactions table policies - OPTIMIZED
-- Users can view their own interactions
CREATE POLICY "Users can view own interactions" ON user_interactions
    FOR SELECT USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = user_interactions."userId"));

-- Users can create their own interactions
CREATE POLICY "Users can create own interactions" ON user_interactions
    FOR INSERT WITH CHECK ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = user_interactions."userId"));

-- AI Analyses table policies - OPTIMIZED
-- Users can view their own AI analyses
CREATE POLICY "Users can view own AI analyses" ON ai_analyses
    FOR SELECT USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = ai_analyses."userId"));

-- Users can create their own AI analyses
CREATE POLICY "Users can create own AI analyses" ON ai_analyses
    FOR INSERT WITH CHECK ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = ai_analyses."userId"));

-- Repository Analyses table policies - OPTIMIZED
-- Users can view their own repository analyses
CREATE POLICY "Users can view own repository analyses" ON repository_analyses
    FOR SELECT USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = repository_analyses."userId"));

-- Users can create their own repository analyses
CREATE POLICY "Users can create own repository analyses" ON repository_analyses
    FOR INSERT WITH CHECK ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = repository_analyses."userId"));

-- Popular Repositories table policies - OPTIMIZED
-- Everyone can view popular repositories (public data)
CREATE POLICY "Everyone can view popular repositories" ON popular_repositories
    FOR SELECT USING (true);

-- Recommendation Cache table policies - OPTIMIZED
-- Users can view their own cache entries
CREATE POLICY "Users can view own cache entries" ON recommendation_cache
    FOR SELECT USING ((select auth.uid())::text = "userId");

-- Users can create their own cache entries
CREATE POLICY "Users can create own cache entries" ON recommendation_cache
    FOR INSERT WITH CHECK ((select auth.uid())::text = "userId");

-- Community Stats table policies - OPTIMIZED
-- Everyone can view community stats (public data)
CREATE POLICY "Everyone can view community stats" ON community_stats
    FOR SELECT USING (true);

-- Contributions table policies - OPTIMIZED
-- Users can view their own contributions
CREATE POLICY "Users can view own contributions" ON contributions
    FOR SELECT USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = contributions."userId"));

-- Users can create their own contributions
CREATE POLICY "Users can create own contributions" ON contributions
    FOR INSERT WITH CHECK ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = contributions."userId"));

-- Users can update their own contributions
CREATE POLICY "Users can update own contributions" ON contributions
    FOR UPDATE USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = contributions."userId"));

-- Contributor Portfolios table policies - OPTIMIZED
-- Users can view their own portfolio
CREATE POLICY "Users can view own portfolio" ON contributor_portfolios
    FOR SELECT USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = contributor_portfolios."userId"));

-- Users can update their own portfolio
CREATE POLICY "Users can update own portfolio" ON contributor_portfolios
    FOR UPDATE USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = contributor_portfolios."userId"));

-- Impact Analyses table policies - OPTIMIZED
-- Users can view their own impact analyses
CREATE POLICY "Users can view own impact analyses" ON impact_analyses
    FOR SELECT USING ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = impact_analyses."userId"));

-- Users can create their own impact analyses
CREATE POLICY "Users can create own impact analyses" ON impact_analyses
    FOR INSERT WITH CHECK ((select auth.uid())::text = (SELECT "clerkId" FROM users WHERE id = impact_analyses."userId"));

-- Repository References table policies - OPTIMIZED
-- Everyone can view repository references (public data)
CREATE POLICY "Everyone can view repository references" ON repository_references
    FOR SELECT USING (true);

-- System Config table policies - OPTIMIZED
-- Only admins can manage system config (for now, restrict access completely)
CREATE POLICY "Admins can manage system config" ON system_config
    FOR ALL USING (false);

-- Prisma migrations table - restrict all access (internal use only)
CREATE POLICY "No access to prisma migrations" ON _prisma_migrations
    FOR ALL USING (false);

-- Create optimized function to get user ID from auth.uid()
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS uuid AS $$
BEGIN
  RETURN (SELECT id FROM users WHERE "clerkId" = (select auth.uid())::text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
