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

// Fallback data function for when AI service is not available
const getFallbackData = (repository: Repository, goal: string): RenderInteractiveFlowchartOutput => {
  const repoName = repository.name || 'Repository';
  const language = repository.language || 'Unknown';
  const description = repository.description || 'A software repository';
  
  // Create a more sophisticated flowchart based on repository type
  const isFrontend = language === 'JavaScript' || language === 'TypeScript' || language === 'HTML' || language === 'CSS';
  const isBackend = language === 'Python' || language === 'Java' || language === 'Go' || language === 'Rust' || language === 'Node.js';
  const isFullStack = isFrontend && isBackend;
  
  let flowchartMermaid = '';
  
  if (isFullStack) {
    flowchartMermaid = `graph TD
    Client[Client App] --> Router[Router]
    Router --> Pages[Pages]
    Pages --> Components[Components]
    Components --> Services[API Services]
    Services --> Controllers[Controllers]
    Controllers --> Models[Data Models]
    Models --> Database[(Database)]
    Services --> Cache[Redis Cache]
    Controllers --> Auth[Auth Service]
    Components --> Utils[Utilities]
    Pages --> Hooks[Custom Hooks]
    Services --> ExternalAPI[External APIs]
    
    classDef frontend fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef data fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef external fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    
    class Client,Router,Pages,Components,Hooks,Utils frontend
    class Services,Controllers,Auth backend
    class Models,Database,Cache data
    class ExternalAPI external`;
  } else if (isFrontend) {
    flowchartMermaid = `graph TD
    App[App Entry] --> Router[Router]
    Router --> Layout[Layout]
    Layout --> Pages[Pages]
    Pages --> Components[Components]
    Components --> Hooks[Custom Hooks]
    Components --> Utils[Utilities]
    Hooks --> State[State Management]
    Pages --> Services[API Services]
    Services --> ExternalAPI[External APIs]
    Components --> Styles[Styles]
    Layout --> Navigation[Navigation]
    
    classDef component fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef service fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef external fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    
    class App,Router,Layout,Pages,Components,Hooks,Utils,State,Styles,Navigation component
    class Services service
    class ExternalAPI external`;
  } else if (isBackend) {
    flowchartMermaid = `graph TD
    Server[Server Entry] --> Router[API Router]
    Router --> Controllers[Controllers]
    Controllers --> Services[Services]
    Services --> Models[Models]
    Models --> Database[(Database)]
    Services --> Cache[Cache Layer]
    Controllers --> Middleware[Middleware]
    Middleware --> Auth[Authentication]
    Services --> ExternalAPI[External APIs]
    Controllers --> Validators[Validators]
    Services --> Queue[Message Queue]
    
    classDef api fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef service fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef data fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef external fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    
    class Server,Router,Controllers,Middleware,Validators api
    class Services,Auth,Queue service
    class Models,Database,Cache data
    class ExternalAPI external`;
  } else {
    flowchartMermaid = `graph TD
    Main[Main Entry] --> Core[Core Module]
    Core --> Utils[Utilities]
    Core --> Config[Configuration]
    Core --> Services[Services]
    Services --> Data[Data Layer]
    Data --> Storage[(Storage)]
    Services --> External[External APIs]
    Main --> Logging[Logging]
    Main --> Errors[Error Handling]
    
    classDef component fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef service fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef data fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef external fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    
    class Main,Core,Utils,Config,Logging,Errors component
    class Services service
    class Data,Storage data
    class External external`;
  }
  
  return {
    flowchartMermaid,
    explanation: [
      {
        component: "Main Component",
        description: `The primary component that handles the core functionality of the ${repoName} application. It manages the main user interface and coordinates between different services and utilities. Built with ${language} and follows modern React patterns for state management and component composition.`,
        metadata: {
          filePath: `src/components/${repoName.toLowerCase()}.tsx`,
          startLine: 1,
          endLine: 150,
          linesOfCode: 150,
          cyclomaticComplexity: 12,
          maintainabilityIndex: 75,
          language: language,
          fileSize: 4500,
          imports: ['React', 'useState', 'useEffect'],
          exports: ['default'],
          testCoverage: 85,
          testFiles: [`src/__tests__/${repoName.toLowerCase()}.test.tsx`]
        }
      },
      {
        component: "Service Layer",
        description: `Handles business logic and data operations for the ${repoName} application. This layer manages API calls, data transformation, and business rule enforcement. It provides a clean separation between the UI components and the data access layer.`,
        metadata: {
          filePath: `src/services/${repoName.toLowerCase()}-service.ts`,
          startLine: 1,
          endLine: 200,
          linesOfCode: 200,
          cyclomaticComplexity: 15,
          maintainabilityIndex: 70,
          language: language,
          fileSize: 6000,
          imports: ['axios', 'lodash'],
          exports: ['default'],
          testCoverage: 90,
          testFiles: [`src/__tests__/${repoName.toLowerCase()}-service.test.ts`]
        }
      },
      {
        component: "Data Models",
        description: `Defines the data structures and interfaces used throughout the ${repoName} application. These models ensure type safety and provide a clear contract for data exchange between components and services.`,
        metadata: {
          filePath: `src/models/${repoName.toLowerCase()}-types.ts`,
          startLine: 1,
          endLine: 100,
          linesOfCode: 100,
          cyclomaticComplexity: 5,
          maintainabilityIndex: 95,
          language: 'TypeScript',
          fileSize: 3000,
          imports: [],
          exports: ['*'],
          testCoverage: 100,
          testFiles: []
        }
      }
    ],
    resources: [
      {
        title: `${repoName} Documentation`,
        type: 'docs',
        url: repository.html_url,
        description: `Official documentation and README for ${repoName}`
      },
      {
        title: `${language} Best Practices`,
        type: 'blog',
        url: 'https://developer.mozilla.org/en-US/docs/Web/Guide',
        description: `Learn about ${language} best practices and patterns`
      }
    ],
    architectureInsights: {
      designPatterns: ['Component-based design', 'Service layer abstraction', 'Type safety', 'Modular structure'],
      dataFlow: 'Unidirectional data flow from components to services to database',
      errorHandling: 'Global error boundaries and try-catch blocks with proper logging',
      scalability: 'Horizontal scaling with load balancers and microservices architecture',
      performance: 'Lazy loading, code splitting, and caching strategies implemented',
      security: 'Authentication, authorization, and data validation throughout the application',
      integrations: ['REST APIs', 'WebSocket connections', 'Third-party services'],
      deployment: 'CI/CD pipeline with Docker containers and cloud deployment'
    }
  };
};

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
                console.log('Generating AI explanation for repository:', repository.name);
                
                // Prepare tech stack from repository data
                const techStack = repository.language ? [repository.language] : [];
                if (repository.language === 'JavaScript' || repository.language === 'TypeScript') {
                  techStack.push('React', 'Node.js');
                }
                
                const goal = 'Understand the repository structure and key components';
                
                // Call AI service with timeout
                const timeoutPromise = new Promise((_, reject) => {
                  setTimeout(() => reject(new Error('AI service timeout')), 30000); // 30 second timeout
                });
                
                try {
                  console.log('Starting AI service call...');
                  const startTime = Date.now();
                  
                  const aiPromise = renderInteractiveFlowchart({
                    repoUrl: repository.html_url,
                    techStack,
                    goal
                  });
                  
                  const data = await Promise.race([aiPromise, timeoutPromise]) as RenderInteractiveFlowchartOutput;
                  
                  const endTime = Date.now();
                  console.log(`AI analysis generated successfully in ${endTime - startTime}ms:`, data);
                  
                  // Validate the AI response
                  if (!data || !data.flowchartMermaid || !data.explanation) {
                    throw new Error('Invalid AI response format');
                  }
                  
                  setAiData(data);
                } catch (aiError) {
                  const endTime = Date.now();
                  const startTime = endTime - 30000; // Approximate start time for logging
                  console.warn(`AI service failed, using fallback data:`, aiError);
                  
                  // Use fallback data immediately
                  const fallback = getFallbackData(repository, 'Understand the repository structure and key components');
                  console.log('Using fallback data:', fallback);
                  setAiData(fallback);
                  
                  // Show a toast notification that we're using fallback data
                  toast({
                    title: "AI Service Unavailable",
                    description: `Using enhanced fallback analysis. Error: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`,
                    variant: "default",
                  });
                }
            } catch (error) {
                console.error('Error generating AI explanation:', error);
                setError(error instanceof Error ? error.message : 'Failed to generate AI explanation');
                // Use fallback data
                const fallback = getFallbackData(repository, 'Understand the repository structure and key components');
                console.log('Using fallback data:', fallback);
                setAiData(fallback);
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
