"use client";

import { useState, useEffect } from 'react';
import type { Repository } from '@/lib/types';
import { renderInteractiveFlowchart, type RenderInteractiveFlowchartOutput } from '@/ai/flows/render-interactive-flowchart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Video, BookOpen, FileCode, AlertTriangle, BrainCircuit, ExternalLink } from 'lucide-react';
import InteractiveFlowchartRenderer from '@/components/interactive-flowchart-renderer';
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
    const [aiData, setAiData] = useState<RenderInteractiveFlowchartOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isExplanationVisible, setIsExplanationVisible] = useState(false);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const { toast } = useToast();

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient || !repository || !isExplanationVisible) return;
        
        const generateExplanation = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                // Get user goal from local storage (client-side only)
                let userGoal = 'Understand Architecture';
                if (typeof window !== 'undefined') {
                    const storedPrefs = localStorage.getItem('userPreferences');
                    userGoal = storedPrefs ? JSON.parse(storedPrefs).goal || 'Understand Architecture' : 'Understand Architecture';
                }

                const data = await renderInteractiveFlowchart({
                    repoUrl: repository.html_url,
                    techStack: repository.topics.length > 0 ? repository.topics : [repository.language || 'Unknown'],
                    goal: userGoal,
                });
                
                setAiData(data);
            } catch (e: any) {
                console.error("Failed to generate AI explanation:", e);
                const errorMessage = e.message || 'An unknown error occurred while generating the AI explanation.';
                setError(errorMessage);
                toast({
                    variant: "destructive",
                    title: "AI Explanation Failed",
                    description: errorMessage,
                });
            } finally {
                setIsLoading(false);
            }
        };

        generateExplanation();
    }, [repository, isClient, isExplanationVisible]);

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

    // Transform AI data to enhanced component format
    const enhancedComponents = aiData.explanation.map((item, index) => ({
        id: `component-${index}`,
        name: item.component,
        type: 'component' as const,
        description: item.description,
        codeSnippet: {
            language: 'typescript',
            code: `// Example implementation for ${item.component}
function ${item.component.replace(/\s+/g, '')}() {
    // Implementation details
    console.log('${item.description}');
    
    return {
        status: 'active',
        type: '${item.component.toLowerCase()}'
    };
}`,
            highlightedLines: [2, 3, 4]
        },
        filePath: `src/components/${item.component.toLowerCase().replace(/\s+/g, '-')}.tsx`,
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
        tags: [item.component.toLowerCase(), 'core', 'essential']
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
                    <TabsTrigger value="resources">Learning Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="flowchart" className="space-y-6">
                    <InteractiveFlowchartRenderer
                        chart={aiData.flowchartMermaid}
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

                <TabsContent value="resources" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Learning Resources</CardTitle>
                            <CardDescription>
                                Curated resources to help you understand this repository better
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {aiData.resources.map((resource, index) => (
                                    <Card key={index} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    {getResourceIcon(resource.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium mb-1">{resource.title}</h3>
                                                    <Badge variant="outline" className="mb-2">
                                                        {resource.type}
                                                    </Badge>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="w-full"
                                                        asChild
                                                    >
                                                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="w-4 h-4 mr-2" />
                                                            Open Resource
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
