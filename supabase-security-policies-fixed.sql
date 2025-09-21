-- =============================================
-- SUPABASE SECURITY POLICIES FOR OPENSOURCE
-- =============================================

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

-- Users table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = "clerkId");

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = "clerkId");

-- User Profiles table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own user profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own user profile" ON user_profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own user profile" ON user_profiles
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_profiles."userId"));

-- Users can update their own profile
CREATE POLICY "Users can update own user profile" ON user_profiles
    FOR UPDATE USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_profiles."userId"));

-- Repositories table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view repositories" ON repositories;

-- Everyone can view repositories (public data)
CREATE POLICY "Everyone can view repositories" ON repositories
    FOR SELECT USING (true);

-- User Onboarding Preferences table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own onboarding preferences" ON user_onboarding_preferences;
DROP POLICY IF EXISTS "Users can update own onboarding preferences" ON user_onboarding_preferences;

-- Users can view their own onboarding preferences
CREATE POLICY "Users can view own onboarding preferences" ON user_onboarding_preferences
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_onboarding_preferences."userId"));

-- Users can update their own onboarding preferences
CREATE POLICY "Users can update own onboarding preferences" ON user_onboarding_preferences
    FOR UPDATE USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_onboarding_preferences."userId"));

-- User ML Preferences table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own ML preferences" ON user_ml_preferences;
DROP POLICY IF EXISTS "Users can update own ML preferences" ON user_ml_preferences;

-- Users can view their own ML preferences
CREATE POLICY "Users can view own ML preferences" ON user_ml_preferences
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_ml_preferences."userId"));

-- Users can update their own ML preferences
CREATE POLICY "Users can update own ML preferences" ON user_ml_preferences
    FOR UPDATE USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_ml_preferences."userId"));

-- Technical Skills table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own technical skills" ON technical_skills;
DROP POLICY IF EXISTS "Users can manage own technical skills" ON technical_skills;

-- Users can view their own skills
CREATE POLICY "Users can view own technical skills" ON technical_skills
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = technical_skills."userId"));

-- Users can manage their own skills
CREATE POLICY "Users can manage own technical skills" ON technical_skills
    FOR ALL USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = technical_skills."userId"));

-- Learning Goals table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own learning goals" ON learning_goals;
DROP POLICY IF EXISTS "Users can manage own learning goals" ON learning_goals;

-- Users can view their own learning goals
CREATE POLICY "Users can view own learning goals" ON learning_goals
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = learning_goals."userId"));

-- Users can manage their own learning goals
CREATE POLICY "Users can manage own learning goals" ON learning_goals
    FOR ALL USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = learning_goals."userId"));

-- Saved Repositories table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own saved repositories" ON saved_repositories;
DROP POLICY IF EXISTS "Users can manage own saved repositories" ON saved_repositories;

-- Users can view their own saved repositories
CREATE POLICY "Users can view own saved repositories" ON saved_repositories
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = saved_repositories."userId"));

-- Users can manage their own saved repositories
CREATE POLICY "Users can manage own saved repositories" ON saved_repositories
    FOR ALL USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = saved_repositories."userId"));

-- User Interactions table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own interactions" ON user_interactions;
DROP POLICY IF EXISTS "Users can create own interactions" ON user_interactions;

-- Users can view their own interactions
CREATE POLICY "Users can view own interactions" ON user_interactions
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_interactions."userId"));

-- Users can create their own interactions
CREATE POLICY "Users can create own interactions" ON user_interactions
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_interactions."userId"));

-- AI Analyses table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own AI analyses" ON ai_analyses;
DROP POLICY IF EXISTS "Users can create own AI analyses" ON ai_analyses;

-- Users can view their own AI analyses
CREATE POLICY "Users can view own AI analyses" ON ai_analyses
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = ai_analyses."userId"));

-- Users can create their own AI analyses
CREATE POLICY "Users can create own AI analyses" ON ai_analyses
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = ai_analyses."userId"));

-- Repository Analyses table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own repository analyses" ON repository_analyses;
DROP POLICY IF EXISTS "Users can create own repository analyses" ON repository_analyses;

-- Users can view their own repository analyses
CREATE POLICY "Users can view own repository analyses" ON repository_analyses
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = repository_analyses."userId"));

-- Users can create their own repository analyses
CREATE POLICY "Users can create own repository analyses" ON repository_analyses
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = repository_analyses."userId"));

-- Popular Repositories table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view popular repositories" ON popular_repositories;

-- Everyone can view popular repositories (public data)
CREATE POLICY "Everyone can view popular repositories" ON popular_repositories
    FOR SELECT USING (true);

-- Recommendation Cache table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own cache entries" ON recommendation_cache;
DROP POLICY IF EXISTS "Users can create own cache entries" ON recommendation_cache;

-- Users can view their own cache entries
CREATE POLICY "Users can view own cache entries" ON recommendation_cache
    FOR SELECT USING (auth.uid()::text = "userId");

-- Users can create their own cache entries
CREATE POLICY "Users can create own cache entries" ON recommendation_cache
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Community Stats table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view community stats" ON community_stats;

-- Everyone can view community stats (public data)
CREATE POLICY "Everyone can view community stats" ON community_stats
    FOR SELECT USING (true);

-- Contributions table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own contributions" ON contributions;
DROP POLICY IF EXISTS "Users can create own contributions" ON contributions;
DROP POLICY IF EXISTS "Users can update own contributions" ON contributions;

-- Users can view their own contributions
CREATE POLICY "Users can view own contributions" ON contributions
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = contributions."userId"));

-- Users can create their own contributions
CREATE POLICY "Users can create own contributions" ON contributions
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = contributions."userId"));

-- Users can update their own contributions
CREATE POLICY "Users can update own contributions" ON contributions
    FOR UPDATE USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = contributions."userId"));

-- Contributor Portfolios table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own portfolio" ON contributor_portfolios;
DROP POLICY IF EXISTS "Users can update own portfolio" ON contributor_portfolios;

-- Users can view their own portfolio
CREATE POLICY "Users can view own portfolio" ON contributor_portfolios
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = contributor_portfolios."userId"));

-- Users can update their own portfolio
CREATE POLICY "Users can update own portfolio" ON contributor_portfolios
    FOR UPDATE USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = contributor_portfolios."userId"));

-- Impact Analyses table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own impact analyses" ON impact_analyses;
DROP POLICY IF EXISTS "Users can create own impact analyses" ON impact_analyses;

-- Users can view their own impact analyses
CREATE POLICY "Users can view own impact analyses" ON impact_analyses
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = impact_analyses."userId"));

-- Users can create their own impact analyses
CREATE POLICY "Users can create own impact analyses" ON impact_analyses
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = impact_analyses."userId"));

-- Repository References table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Everyone can view repository references" ON repository_references;

-- Everyone can view repository references (public data)
CREATE POLICY "Everyone can view repository references" ON repository_references
    FOR SELECT USING (true);

-- System Config table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage system config" ON system_config;

-- Only admins can manage system config (for now, restrict access completely)
CREATE POLICY "Admins can manage system config" ON system_config
    FOR ALL USING (false);

-- Create function to get user ID from auth.uid()
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS uuid AS $$
BEGIN
  RETURN (SELECT id FROM users WHERE "clerkId" = auth.uid()::text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
