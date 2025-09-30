"use client";

import { useState } from 'react';
import type { Repository } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, ExternalLink, Star, GitBranch, Users, Code, Calendar, Sparkles, Loader2, Brain, Target } from 'lucide-react';
import EnhancedMermaidChart from './enhanced-mermaid-chart';
import { gitdiagramStyleAnalysis } from '@/ai/flows/gitdiagram-style-analysis';


interface RepoExplanationClientProps {
    repository: Repository;
}

export default function RepoExplanationClient({ repository }: RepoExplanationClientProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiData, setAiData] = useState<any>(null);
    const [zoomingEnabled, setZoomingEnabled] = useState(true);

    const handleAnalyzeRepository = async () => {
        setIsAnalyzing(true);
        
        try {
            const result = await gitdiagramStyleAnalysis({
                repoUrl: repository.html_url,
                techStack: repository.language ? [repository.language] : [],
                goal: 'Analyze repository architecture and generate interactive flowchart'
            });
            console.log('Analysis result:', result);
            console.log('Mermaid chart:', result.mermaidChart);
            setAiData(result);
        } catch (error) {
            console.error('Error analyzing repository:', error);
            setAiData({
                error: 'Failed to analyze repository. Please try again.',
                mermaidChart: '',
                explanation: 'Analysis failed. Please check the repository and try again.',
                componentMapping: '',
                summary: 'Unable to complete analysis due to an error.'
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!repository) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Alert className="max-w-md">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Repository Not Found</AlertTitle>
                    <AlertDescription>
                        The repository information is not available. Please try again or select a different repository.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Repository Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">{repository.name}</h2>
                    <p className="text-muted-foreground">
                        {repository.description || 'No description available'}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button 
                        variant="outline" 
                        asChild
                    >
                        <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View on GitHub
                        </a>
                    </Button>
                    <Button 
                        onClick={handleAnalyzeRepository}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Explain with OpenSauce
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Repository Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <div>
                                <p className="text-2xl font-bold">{repository.stargazers_count?.toLocaleString() || 0}</p>
                                <p className="text-xs text-muted-foreground">Stars</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <GitBranch className="h-4 w-4 text-blue-500" />
                            <div>
                                <p className="text-2xl font-bold">{repository.forks_count?.toLocaleString() || 0}</p>
                                <p className="text-xs text-muted-foreground">Forks</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-green-500" />
                            <div>
                                <p className="text-2xl font-bold">{repository.contributor_count?.toLocaleString() || 0}</p>
                                <p className="text-xs text-muted-foreground">Contributors</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Code className="h-4 w-4 text-purple-500" />
                            <div>
                                <p className="text-2xl font-bold">{repository.language || 'Unknown'}</p>
                                <p className="text-xs text-muted-foreground">Language</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Interactive Flowchart Section */}
            {isAnalyzing ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            Analyzing Repository Architecture
                        </CardTitle>
                        <CardDescription>
                            OpenSauce AI is analyzing the repository structure and generating flowchart...
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                <span className="text-sm">Fetching repository structure...</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Loader2 className="h-4 w-4 animate-spin text-green-500" />
                                <span className="text-sm">Analyzing code components...</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                                <span className="text-sm">Generating architecture insights...</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                                <span className="text-sm">Creating interactive flowchart...</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : aiData ? (
                <>
                    {aiData.error && (
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Analysis Error</AlertTitle>
                            <AlertDescription>{aiData.error}</AlertDescription>
                        </Alert>
                    )}
                    
                    {/* Interactive Flowchart */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        Architecture Flowchart
                                    </CardTitle>
                                    <CardDescription>
                                        Interactive visualization of repository architecture and component relationships
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-muted-foreground">Zoom</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setZoomingEnabled(!zoomingEnabled)}
                                        className="h-8 w-8 p-0"
                                    >
                                        {zoomingEnabled ? (
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        ) : (
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                            </svg>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <EnhancedMermaidChart
                                chart={aiData.mermaidChart || `graph TD
    A[Repository Analysis] --> B[Architecture Overview]
    B --> C[Component Structure]
    C --> D[Data Flow]
    D --> E[Dependencies]
    
    classDef default fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    class A,B,C,D,E default`}
                                zoomingEnabled={zoomingEnabled}
                            />
                        </CardContent>
                    </Card>
                </>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Ready for AI Analysis</h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                            Click "Explain with OpenSauce" to generate an interactive flowchart of this repository
                        </p>
                        <Button onClick={handleAnalyzeRepository}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Flowchart
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
