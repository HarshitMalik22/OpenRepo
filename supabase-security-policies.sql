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

-- Users table policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = "clerkId");

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can update own profile" ON users;
-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = "clerkId");

-- User Profiles table policies
-- Users can view their own profile
CREATE POLICY "Users can view own user profile" ON user_profiles
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_profiles.user_id));

-- Users can update their own profile
CREATE POLICY "Users can update own user profile" ON user_profiles
    FOR UPDATE USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_profiles.user_id));

-- Repositories table policies
-- Everyone can view repositories (public data)
CREATE POLICY "Everyone can view repositories" ON repositories
    FOR SELECT USING (true);

-- User Onboarding Preferences table policies
-- Users can view their own onboarding preferences
CREATE POLICY "Users can view own onboarding preferences" ON user_onboarding_preferences
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_onboarding_preferences.user_id));

-- Users can update their own onboarding preferences
CREATE POLICY "Users can update own onboarding preferences" ON user_onboarding_preferences
    FOR UPDATE USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_onboarding_preferences.user_id));

-- User ML Preferences table policies
-- Users can view their own ML preferences
CREATE POLICY "Users can view own ML preferences" ON user_ml_preferences
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_ml_preferences.user_id));

-- Users can update their own ML preferences
CREATE POLICY "Users can update own ML preferences" ON user_ml_preferences
    FOR UPDATE USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_ml_preferences.user_id));

-- Technical Skills table policies
-- Users can view their own skills
CREATE POLICY "Users can view own technical skills" ON technical_skills
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = technical_skills.user_id));

-- Users can manage their own skills
CREATE POLICY "Users can manage own technical skills" ON technical_skills
    FOR ALL USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = technical_skills.user_id));

-- Learning Goals table policies
-- Users can view their own learning goals
CREATE POLICY "Users can view own learning goals" ON learning_goals
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = learning_goals.user_id));

-- Users can manage their own learning goals
CREATE POLICY "Users can manage own learning goals" ON learning_goals
    FOR ALL USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = learning_goals.user_id));

-- Saved Repositories table policies
-- Users can view their own saved repositories
CREATE POLICY "Users can view own saved repositories" ON saved_repositories
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = saved_repositories.user_id));

-- Users can manage their own saved repositories
CREATE POLICY "Users can manage own saved repositories" ON saved_repositories
    FOR ALL USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = saved_repositories.user_id));

-- User Interactions table policies
-- Users can view their own interactions
CREATE POLICY "Users can view own interactions" ON user_interactions
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_interactions.user_id));

-- Users can create their own interactions
CREATE POLICY "Users can create own interactions" ON user_interactions
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = user_interactions.user_id));

-- AI Analyses table policies
-- Users can view their own AI analyses
CREATE POLICY "Users can view own AI analyses" ON ai_analyses
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = ai_analyses.user_id));

-- Users can create their own AI analyses
CREATE POLICY "Users can create own AI analyses" ON ai_analyses
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = ai_analyses.user_id));

-- Repository Analyses table policies
-- Users can view their own repository analyses
CREATE POLICY "Users can view own repository analyses" ON repository_analyses
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = repository_analyses.user_id));

-- Users can create their own repository analyses
CREATE POLICY "Users can create own repository analyses" ON repository_analyses
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = repository_analyses.user_id));

-- Popular Repositories table policies
-- Everyone can view popular repositories (public data)
CREATE POLICY "Everyone can view popular repositories" ON popular_repositories
    FOR SELECT USING (true);

-- Recommendation Cache table policies
-- Users can view their own cache entries
CREATE POLICY "Users can view own cache entries" ON recommendation_cache
    FOR SELECT USING (auth.uid()::text = user_id);

-- Users can create their own cache entries
CREATE POLICY "Users can create own cache entries" ON recommendation_cache
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Community Stats table policies
-- Everyone can view community stats (public data)
CREATE POLICY "Everyone can view community stats" ON community_stats
    FOR SELECT USING (true);

-- Contributions table policies
-- Users can view their own contributions
CREATE POLICY "Users can view own contributions" ON contributions
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = contributions.user_id));

-- Users can create their own contributions
CREATE POLICY "Users can create own contributions" ON contributions
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = contributions.user_id));

-- Users can update their own contributions
CREATE POLICY "Users can update own contributions" ON contributions
    FOR UPDATE USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = contributions.user_id));

-- Contributor Portfolios table policies
-- Users can view their own portfolio
CREATE POLICY "Users can view own portfolio" ON contributor_portfolios
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = contributor_portfolios.user_id));

-- Users can update their own portfolio
CREATE POLICY "Users can update own portfolio" ON contributor_portfolios
    FOR UPDATE USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = contributor_portfolios.user_id));

-- Impact Analyses table policies
-- Users can view their own impact analyses
CREATE POLICY "Users can view own impact analyses" ON impact_analyses
    FOR SELECT USING (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = impact_analyses.user_id));

-- Users can create their own impact analyses
CREATE POLICY "Users can create own impact analyses" ON impact_analyses
    FOR INSERT WITH CHECK (auth.uid()::text = (SELECT "clerkId" FROM users WHERE id = impact_analyses.user_id));

-- Repository References table policies
-- Everyone can view repository references (public data)
CREATE POLICY "Everyone can view repository references" ON repository_references
    FOR SELECT USING (true);

-- Create function to get user ID from auth.uid()
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS uuid AS $$
BEGIN
  RETURN (SELECT id FROM users WHERE "clerkId" = auth.uid()::text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
