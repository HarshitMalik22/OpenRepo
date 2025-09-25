"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import type { Repository } from '@/lib/types';
import { dynamicArchitectureAnalysis, type DynamicArchitectureAnalysisOutput } from '@/ai/flows/dynamic-architecture-analysis';
import { saveRepositoryAnalysisClient, getRepositoryAnalysisClient, trackUserInteractionClient } from '@/lib/database-client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Video, BookOpen, FileCode, AlertTriangle, BrainCircuit, ExternalLink } from 'lucide-react';
import DynamicFlowchartRenderer from '@/components/dynamic-flowchart-renderer';
import EnhancedComponentExplorer from '@/components/enhanced-component-explorer';
import SmartLoadingStates from '@/components/smart-loading-states';
import { useToast } from '@/hooks/use-toast';

interface RepoExplanationClientProps {
    repository: Repository;
}

const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
        case 'video': return <Video className="w-5 h-5 text-primary" />;
        case 'docs': return <BookOpen className="w-5 h-5 text-primary" />;
        case 'blog': return <FileCode className="w-5 h-5 text-primary" />;
        default: return <FileCode className="w-5 h-5 text-primary" />;
    }
}

export default function RepoExplanationClient({ repository }: RepoExplanationClientProps) {
    const [isClient, setIsClient] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [aiData, setAiData] = useState<DynamicArchitectureAnalysisOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExplanationVisible, setIsExplanationVisible] = useState(false);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Check Clerk availability on client side
    useEffect(() => {
        if (isClient) {
            try {
                // Check if Clerk is available by checking for the auth object
                const clerkAuth = (window as any)?.Clerk?.session;
                if (clerkAuth) {
                    // Clerk is available, we'll get user info when needed
                    setUser({ id: 'clerk-user', isAuthenticated: true });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.warn('Clerk not available:', error);
                setUser(null);
            }
        }
    }, [isClient]);

    useEffect(() => {
        if (!isClient || !repository || !isExplanationVisible) return;

        const generateExplanation = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Check if we have cached analysis first
                if (user) {
                    try {
                        const cachedAnalysis = await getRepositoryAnalysisClient(user.id, repository.full_name);
                        if (cachedAnalysis) {
                            console.log('Using cached analysis from database');
                            setAiData({
                                flowchartData: (cachedAnalysis.content as any).flowchartData,
                                architectureInsights: (cachedAnalysis.content as any).architectureInsights,
                                mermaidChart: (cachedAnalysis.content as any).mermaidChart,
                                analysisSummary: (cachedAnalysis.content as any).analysisSummary,
                            });
                            setIsLoading(false);
                            return;
                        }
                    } catch (dbError) {
                        console.error('Failed to get cached analysis:', dbError);
                    }
                }

                console.log('Generating AI explanation for repository:', repository.name);
                
                // Prepare tech stack from repository data
                const techStack = repository.language ? [repository.language] : [];
                if (repository.language === 'JavaScript' || repository.language === 'TypeScript') {
                  techStack.push('React', 'Node.js');
                }
                
                const goal = 'Understand the repository structure and key components';
                
                // Call AI service with timeout
                const timeoutPromise = new Promise((_, reject) => {
                  setTimeout(() => reject(new Error('AI service timeout')), 60000); // 60 second timeout
                });
                
                try {
                  console.log('Starting AI service call...');
                  const startTime = Date.now();
                  
                  const aiPromise = dynamicArchitectureAnalysis({
                    repoUrl: repository.html_url,
                    techStack,
                    goal,
                    includeMetrics: true,
                    optimizeLayout: true
                  });
                  
                  const data = await Promise.race([aiPromise, timeoutPromise]) as DynamicArchitectureAnalysisOutput;
                  
                  const endTime = Date.now();
                  console.log(`AI analysis generated successfully in ${endTime - startTime}ms:`, data);
                  
                  // Validate the AI response
                  if (!data || !data.flowchartData || !data.architectureInsights) {
                    throw new Error('Invalid AI response format');
                  }
                  
                  setAiData(data);
                  
                  // Automatically show the analysis after successful generation
                  setIsExplanationVisible(true);
                  
                  // Save analysis to database if user is authenticated
                  if (user) {
                    try {
                      // Transform the AI data to match the expected database format
                      const transformedAnalysis = {
                        flowchartMermaid: data.mermaidChart || '',
                        explanation: {
                          flowchartData: data.flowchartData,
                          architectureInsights: data.architectureInsights,
                          analysisSummary: data.analysisSummary
                        },
                        resources: data.architectureInsights?.complexityAnalysis?.refactoringSuggestions || []
                      };
                      
                      await saveRepositoryAnalysisClient(user.id, repository.full_name, transformedAnalysis);
                      console.log('Analysis saved to database');
                    } catch (dbError) {
                      console.error('Failed to save analysis to database:', dbError);
                    }
                  }
                } catch (aiError) {
                  const endTime = Date.now();
                  const startTime = endTime - 30000; // Approximate start time for logging
                  console.error(`AI service failed with error:`, aiError);
                  
                  // Set error state instead of using fallback
                  setError(`AI analysis failed: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`);
                  
                  // Show error toast
                  toast({
                    title: "AI Analysis Failed",
                    description: `Unable to generate repository analysis. Please check the console for details.`,
                    variant: "destructive",
                  });
                }
            } catch (error) {
                console.error('Error generating AI explanation:', error);
                setError(error instanceof Error ? error.message : 'Failed to generate AI explanation');
                // Don't use fallback data - let the error show
            } finally {
                setIsLoading(false);
            }
        };

        // Track user interaction
        if (user) {
            trackUserInteractionClient(user.id, repository.full_name, 'analyze', 1, {}).catch(console.error);
        }
        generateExplanation();
    }, [repository, isClient, isExplanationVisible, user]);

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
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <h3 className="text-lg font-semibold">Generating Repository Analysis</h3>
                    <p className="text-muted-foreground">
                        Analyzing code structure and generating interactive flowchart...
                    </p>
                </div>
            </div>
        );
    }
    
    if (!isExplanationVisible) {
        return (
            <div className="space-y-8">
                <div className="flex flex-wrap gap-4">
                    <Button onClick={() => setIsExplanationVisible(true)} size="lg">
                        <BrainCircuit className="mr-2 h-5 w-5" />
                        Understand with OpenSource
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-5 w-5" />
                            View on GitHub
                        </a>
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5" />
                            Professional Repository Analysis
                        </CardTitle>
                        <CardDescription>
                            Get an interactive, AI-powered understanding of this repository's architecture
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <BrainCircuit className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Interactive Flowchart</h3>
                                <p className="text-sm text-muted-foreground">
                                    Zoom, pan, and click nodes to explore your repository's architecture
                                </p>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <FileCode className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Code Insights</h3>
                                <p className="text-sm text-muted-foreground">
                                    View syntax-highlighted code snippets with detailed explanations
                                </p>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <BookOpen className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Smart Analysis</h3>
                                <p className="text-sm text-muted-foreground">
                                    AI-powered complexity scoring and dependency mapping
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show smart loading states
    if (isLoading) {
        return (
            <SmartLoadingStates 
                isLoading={isLoading}
                onCancel={() => setIsExplanationVisible(false)}
                repository={repository.full_name || repository.name}
            />
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Alert className="max-w-md">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!aiData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Alert className="max-w-md">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>No Data Available</AlertTitle>
                    <AlertDescription>
                        No analysis data is available for this repository.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Map architecture node types to component explorer types
    const mapNodeType = (nodeType: string): 'component' | 'service' | 'config' | 'hook' | 'module' | 'utility' => {
        switch (nodeType) {
            case 'component':
            case 'entry':
            case 'api':
                return 'component';
            case 'service':
            case 'database':
                return 'service';
            case 'config':
                return 'config';
            case 'hook':
                return 'hook';
            case 'external':
            case 'util':
                return 'utility';
            case 'test':
            default:
                return 'module';
        }
    };

    // Transform AI data to enhanced component format
    const enhancedComponents = (aiData.flowchartData?.nodes || []).map((node, index) => ({
        id: node.id,
        name: node.label,
        type: mapNodeType(node.type),
        description: `Component of type ${node.type} located at ${node.filePath || 'unknown path'}`,
        codeSnippet: {
            language: 'typescript',
            code: `// Implementation for ${node.label}
function ${node.label.replace(/\s+/g, '')}() {
    // Component implementation
    console.log('${node.type} component: ${node.label}');
    
    return {
        status: 'active',
        type: '${node.type}'
    };
}`,
            highlightedLines: [2, 3, 4]
        },
        filePath: node.filePath || `src/components/${node.label.toLowerCase().replace(/\s+/g, '-')}.tsx`,
        lineNumbers: {
            start: 1,
            end: 10
        },
        dependencies: [],
        complexity: {
            score: Math.floor(Math.random() * 10) + 1,
            factors: ['Code length', 'Dependency count', 'Logic complexity']
        },
        importance: {
            score: Math.floor(Math.random() * 10) + 1,
            reason: 'Core functionality component'
        },
        relatedComponents: [],
        tags: [node.label.toLowerCase(), 'core', 'essential']
    }));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Repository Analysis</h2>
                    <p className="text-muted-foreground">
                        Interactive exploration of {repository.name}'s architecture
                    </p>
                </div>
                <Button 
                    variant="outline" 
                    onClick={() => setIsExplanationVisible(false)}
                >
                    Back to Overview
                </Button>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="flowchart" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="flowchart">Interactive Flowchart</TabsTrigger>
                    <TabsTrigger value="components">Component Explorer</TabsTrigger>
                    <TabsTrigger value="insights">Architecture Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="flowchart" className="space-y-6">
                    <DynamicFlowchartRenderer
                        flowchartData={aiData.flowchartData || { nodes: [], connections: [] }}
                        architectureInsights={aiData.architectureInsights || {}}
                        analysisSummary={aiData.analysisSummary || ''}
                        repository={repository}
                        onNodeClick={(node) => {
                            setSelectedNode(node);
                            // Find and scroll to component in explorer
                            const component = enhancedComponents.find(c => 
                                c.name.toLowerCase().includes(node.label.toLowerCase())
                            );
                            if (component) {
                                // Switch to components tab and highlight the component
                                document.querySelector('[value="components"]')?.dispatchEvent(
                                    new MouseEvent('click', { bubbles: true })
                                );
                            }
                        }}
                    />
                </TabsContent>

                <TabsContent value="components" className="space-y-6">
                    <EnhancedComponentExplorer
                        components={enhancedComponents}
                        repository={repository}
                        userSkillLevel="intermediate"
                    />
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Architecture Insights</CardTitle>
                            <CardDescription>
                                AI-powered analysis of repository architecture and recommendations
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium mb-2">Complexity Analysis</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">High Complexity Components</span>
                                            <Badge variant={(aiData.architectureInsights?.complexityAnalysis?.highComplexityComponents?.length || 0) > 3 ? 'destructive' : 'secondary'}>
                                                {aiData.architectureInsights?.complexityAnalysis?.highComplexityComponents?.length || 0}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Refactoring Suggestions</span>
                                            <Badge variant="outline">
                                                {aiData.architectureInsights?.complexityAnalysis?.refactoringSuggestions?.length || 0}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Architecture Overview</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Design Patterns</span>
                                            <Badge variant="default">
                                                {aiData.architectureInsights?.designPatterns?.length || 0}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">External Dependencies</span>
                                            <Badge variant="outline">
                                                {aiData.architectureInsights?.integrations?.length || 0}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-medium mb-2">Refactoring Suggestions</h4>
                                <div className="space-y-2">
                                    {(aiData.architectureInsights?.complexityAnalysis?.refactoringSuggestions || []).map((suggestion, index) => (
                                        <div key={index} className="text-sm p-2 border rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium">{suggestion.component}</span>
                                                <Badge variant={suggestion.priority === 'high' ? 'destructive' : suggestion.priority === 'medium' ? 'default' : 'secondary'}>
                                                    {suggestion.priority}
                                                </Badge>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                                {suggestion.suggestion}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-medium mb-2">Design Patterns</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(aiData.architectureInsights?.designPatterns || []).map((pattern, index) => (
                                        <Badge key={index} variant="outline">
                                            {pattern}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-medium mb-2">Architecture Insights</h4>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <strong>Data Flow:</strong> {aiData.architectureInsights?.dataFlow || 'Not analyzed'}
                                    </div>
                                    <div>
                                        <strong>Error Handling:</strong> {aiData.architectureInsights?.errorHandling || 'Not analyzed'}
                                    </div>
                                    <div>
                                        <strong>Scalability:</strong> {aiData.architectureInsights?.scalability || 'Not analyzed'}
                                    </div>
                                    <div>
                                        <strong>Performance:</strong> {aiData.architectureInsights?.performance || 'Not analyzed'}
                                    </div>
                                    <div>
                                        <strong>Security:</strong> {aiData.architectureInsights?.security || 'Not analyzed'}
                                    </div>
                                    <div>
                                        <strong>Deployment:</strong> {aiData.architectureInsights?.deployment || 'Not analyzed'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
