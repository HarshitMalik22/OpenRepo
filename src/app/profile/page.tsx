import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, GitBranch, GitCommit, Star, Github, Settings, CheckCircle2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Type definitions
interface RepositoryAnalysis {
  id: string
  created_at: string
  repo_name?: string
  analysis_summary?: string
}

interface SavedRepository {
  id: string
  created_at: string
  name?: string
  full_name?: string
  description?: string
}

interface UserProfile {
  id: string
  full_name?: string | null
  email?: string | null
  avatar_url?: string | null
  created_at: string
  is_pro?: boolean
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

interface UserProfileData {
  id: string
  user_id: string
  bio?: string | null
  github_username?: string | null
  experience_level?: string | null
  stars?: number | null
  is_pro?: boolean
}

// Format date to relative time (e.g., "2 days ago")
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  }
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds)
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`
    }
  }
  
  return 'Just now'
}

export default async function ProfilePage() {
  try {
    const user = await getUser()

    if (!user) {
      redirect('/login')
    }

    const supabase = await createClient()

    // Get user profile data using individual queries for better type safety
    const [
      { data: userData },
      { data: profile },
      { count: savedCount },
      { count: analysesCount },
      { data: recentAnalyses },
      { data: recentRepos }
    ] = await Promise.all([
      supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single(),
      
      supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single(),
      
      supabase
        .from('saved_repositories')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
      
      supabase
        .from('repository_analyses')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
      
      supabase
        .from('repository_analyses')
        .select('id, created_at, repo_name, analysis_summary')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3),
      
      supabase
        .from('saved_repositories')
        .select('id, created_at, name, full_name, description')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)
    ])

    // Type assertions for Supabase responses
    const typedUserData = userData as UserProfile | null;
    const typedProfile = profile as UserProfileData | null;
    const typedSavedCount = savedCount as number | null;
    const typedAnalysesCount = analysesCount as number | null;
    const typedRecentAnalyses = recentAnalyses as RepositoryAnalysis[] | null;
    const typedRecentRepos = recentRepos as SavedRepository[] | null;

    const fullName = typedUserData?.full_name || user.user_metadata?.full_name || 'User';
    const initials = fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
    const memberSince = user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold font-headline">Your Profile</h1>
              {memberSince && (
                <p className="text-muted-foreground flex items-center mt-1">
                  <CalendarDays className="w-4 h-4 mr-1.5" />
                  Member since {memberSince}
                </p>
              )}
            </div>
            <Button asChild variant="outline">
              <Link href="/profile/settings">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* User Info Card */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={typedUserData?.avatar_url || user.user_metadata?.avatar_url || ''} />
                        <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-4 flex-1">
                      <div>
                        <h2 className="text-2xl font-bold">{fullName}</h2>
                        <p className="text-muted-foreground">{user.email || 'No email provided'}</p>
                      </div>
                      
                      {typedProfile?.bio && (
                        <div className="prose prose-sm max-w-none">
                          <p className="text-muted-foreground">{typedProfile.bio}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {typedProfile?.github_username && (
                          <Badge variant="secondary" className="gap-1.5">
                            <Github className="w-3.5 h-3.5" />
                            <a
                              href={`https://github.com/${typedProfile.github_username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              @{typedProfile.github_username}
                            </a>
                          </Badge>
                        )}
                        
                        {typedProfile?.experience_level && (
                          <Badge variant="outline" className="capitalize">
                            {typedProfile.experience_level} Developer
                          </Badge>
                        )}
                        
                        {typedUserData?.is_pro && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white">
                            Pro Member
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest analyses and saved repositories</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="analyses" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="analyses">Recent Analyses</TabsTrigger>
                      <TabsTrigger value="repositories">Saved Repositories</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="analyses" className="mt-4">
                      {typedRecentAnalyses && typedRecentAnalyses.length > 0 ? (
                        <div className="space-y-4">
                          {typedRecentAnalyses.map((analysis) => (
                            <div key={analysis.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{analysis.repo_name || 'Repository Analysis'}</h4>
                                  {analysis.analysis_summary && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                      {analysis.analysis_summary}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                  {formatDate(analysis.created_at)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No recent analyses found.</p>
                          <Button variant="link" className="mt-2" asChild>
                            <Link href="/repos">Analyze a repository</Link>
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="repositories" className="mt-4">
                      {typedRecentRepos && typedRecentRepos.length > 0 ? (
                        <div className="space-y-4">
                          {typedRecentRepos.map((repo) => (
                            <div key={repo.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{repo.name}</h4>
                                  {repo.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                      {repo.description}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                  {formatDate(repo.created_at)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No saved repositories yet.</p>
                          <Button variant="link" className="mt-2" asChild>
                            <Link href="/repos">Browse repositories</Link>
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Stats and Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Your activity summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <GitBranch className="w-4 h-4" />
                        <span className="text-xs font-medium">Repositories</span>
                      </div>
                      <p className="text-2xl font-bold">{typedSavedCount || 0}</p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <GitCommit className="w-4 h-4" />
                        <span className="text-xs font-medium">Analyses</span>
                      </div>
                      <p className="text-2xl font-bold">{typedAnalysesCount || 0}</p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Star className="w-4 h-4" />
                        <span className="text-xs font-medium">Stars</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {typedProfile?.stars || 0}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Member</span>
                      </div>
                      <p className="text-2xl font-bold">
                        {memberSince ? formatDate(user.created_at) : 'New'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-2 space-y-3">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/repos">
                        <GitBranch className="w-4 h-4 mr-2" />
                        Browse Repositories
                      </Link>
                    </Button>
                    
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading profile:', error)
    return (
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't load your profile information. Please try again later.
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    )
  }
}

