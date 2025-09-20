'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Github, 
  TrendingUp, 
  Users, 
  Star, 
  GitBranch, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Zap,
  Target,
  Award,
  BarChart3,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

interface Repository {
  id: string;
  fullName: string;
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  issues: number;
  healthScore: number;
  isActive: boolean;
  lastCommitDate: string | null;
  issueResolutionRate: number;
  prMergeRate: number;
  maintainerActivityScore: number;
  codeQualityScore: number;
  testCoverage: number;
  documentationScore: number;
  difficulty: string;
  competition: string;
  hasContributing: boolean;
}

interface GoodFirstIssue {
  id: string;
  issueNumber: number;
  title: string;
  body: string | null;
  state: string;
  labels: string[];
  estimatedTime: string;
  requiredSkills: string[];
  mentorAvailable: boolean;
  successRate: number;
  difficulty: string;
  type: string;
  language: string | null;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SyncStats {
  totalRepos: number;
  activeRepos: number;
  totalUsers: number;
  activeUsers: number;
  lastSyncTime: string | null;
  pendingJobs: number;
  runningJobs: number;
  failedJobs: number;
}

export default function RealTimeDashboard() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [goodFirstIssues, setGoodFirstIssues] = useState<GoodFirstIssue[]>([]);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [reposResponse, issuesResponse, statsResponse] = await Promise.all([
        fetch('/api/repositories'),
        fetch('/api/good-first-issues'),
        fetch('/api/sync/stats')
      ]);

      if (reposResponse.ok) {
        const reposData = await reposResponse.json();
        setRepositories(reposData.repositories || []);
      }

      if (issuesResponse.ok) {
        const issuesData = await issuesResponse.json();
        setGoodFirstIssues(issuesData.issues || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setSyncStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncRepository = async (owner: string, repo: string) => {
    try {
      setSyncing(true);
      const response = await fetch('/api/sync/repository', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo }),
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error syncing repository:', error);
    } finally {
      setSyncing(false);
    }
  };

  const syncPopularRepos = async () => {
    try {
      setSyncing(true);
      const response = await fetch('/api/sync/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'popular' }),
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error syncing popular repositories:', error);
    } finally {
      setSyncing(false);
    }
  };

  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = repo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = languageFilter === 'all' || repo.language === languageFilter;
    const matchesDifficulty = difficultyFilter === 'all' || repo.difficulty === difficultyFilter;
    const matchesHealth = healthFilter === 'all' || 
                         (healthFilter === 'excellent' && repo.healthScore >= 80) ||
                         (healthFilter === 'good' && repo.healthScore >= 60 && repo.healthScore < 80) ||
                         (healthFilter === 'fair' && repo.healthScore >= 40 && repo.healthScore < 60) ||
                         (healthFilter === 'poor' && repo.healthScore < 40);

    return matchesSearch && matchesLanguage && matchesDifficulty && matchesHealth;
  });

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Real-Time Open Source Dashboard</h1>
          <p className="text-gray-600">Live repository health metrics and contributor opportunities</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchData} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={syncPopularRepos} disabled={syncing}>
            <Zap className="h-4 w-4 mr-2" />
            Sync Popular Repos
          </Button>
        </div>
      </div>

      {/* Sync Stats */}
      {syncStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
              <Github className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{syncStats.totalRepos}</div>
              <p className="text-xs text-muted-foreground">
                {syncStats.activeRepos} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{syncStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {syncStats.activeUsers} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{syncStats.pendingJobs + syncStats.runningJobs}</div>
              <p className="text-xs text-muted-foreground">
                {syncStats.pendingJobs} pending, {syncStats.runningJobs} running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {syncStats.lastSyncTime ? 'Recent' : 'Never'}
              </div>
              <p className="text-xs text-muted-foreground">
                {syncStats.lastSyncTime ? new Date(syncStats.lastSyncTime).toLocaleString() : 'No sync data'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="JavaScript">JavaScript</SelectItem>
                <SelectItem value="TypeScript">TypeScript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Java">Java</SelectItem>
                <SelectItem value="Go">Go</SelectItem>
                <SelectItem value="Rust">Rust</SelectItem>
                <SelectItem value="C++">C++</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            <Select value={healthFilter} onValueChange={setHealthFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Health Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Health Levels</SelectItem>
                <SelectItem value="excellent">Excellent (80+)</SelectItem>
                <SelectItem value="good">Good (60-79)</SelectItem>
                <SelectItem value="fair">Fair (40-59)</SelectItem>
                <SelectItem value="poor">Poor (&lt;40)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Repository Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRepositories.map((repo) => (
          <Card key={repo.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{repo.fullName}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-lg font-bold ${getHealthColor(repo.healthScore)}`}>
                    {repo.healthScore}
                  </div>
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{repo.stars.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch className="h-4 w-4 text-blue-500" />
                    <span>{repo.forks.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>{repo.issues}</span>
                  </div>
                  {repo.language && (
                    <Badge variant="outline">{repo.language}</Badge>
                  )}
                </div>

                {/* Health Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>Issue Resolution:</span>
                    <span className="font-medium">{repo.issueResolutionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PR Merge Rate:</span>
                    <span className="font-medium">{repo.prMergeRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Code Quality:</span>
                    <span className="font-medium">{repo.codeQualityScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Test Coverage:</span>
                    <span className="font-medium">{repo.testCoverage}%</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(repo.difficulty)}>
                    {repo.difficulty}
                  </Badge>
                  <Badge className={getCompetitionColor(repo.competition)}>
                    {repo.competition} competition
                  </Badge>
                  {repo.isActive ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                  {repo.hasContributing && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Award className="h-3 w-3 mr-1" />
                      Contributing Guide
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => syncRepository(repo.owner, repo.name)}
                    disabled={syncing}
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${syncing ? 'animate-spin' : ''}`} />
                    Sync
                  </Button>
                  <Button size="sm" variant="outline">
                    <Target className="h-3 w-3 mr-1" />
                    View Issues
                  </Button>
                  <Button size="sm" variant="outline">
                    <Github className="h-3 w-3 mr-1" />
                    GitHub
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Good First Issues Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Good First Issues ({goodFirstIssues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goodFirstIssues.slice(0, 5).map((issue) => (
              <div key={issue.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{issue.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{issue.body?.substring(0, 150)}...</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{issue.language}</Badge>
                      <Badge variant="outline">{issue.estimatedTime}</Badge>
                      <Badge variant="outline">{issue.successRate}% success rate</Badge>
                      {issue.mentorAvailable && (
                        <Badge className="bg-green-100 text-green-800">
                          Mentor Available
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
