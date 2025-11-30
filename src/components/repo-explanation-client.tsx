"use client";

import { useMemo, useState, useEffect } from 'react';
import type { Repository } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ExternalLink, Star, GitBranch, Users, Code, Calendar, Sparkles, Loader2, Brain, Target, RefreshCw, Bookmark, BookmarkCheck, CheckCircle2, Circle } from 'lucide-react';
import EnhancedMermaidChart from '@/components/enhanced-mermaid-chart';
import { gitdiagramStyleAnalysis } from '@/ai/flows/gitdiagram-style-analysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ComponentMapItem {
    name: string;
    path?: string;
}

const parseComponentMapping = (mapping?: string): ComponentMapItem[] => {
    if (!mapping) return [];
    const cleaned = mapping
        .replace(/<\/?component_mapping>/gi, '')
        .replace(/<\/?component-map>/gi, '')
        .trim();

    if (!cleaned) return [];

    return cleaned
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map((line) => {
            const withoutBullet = line
                .replace(/^\d+[\.\)]\s*/, '')
                .replace(/^[-*•]\s*/, '')
                .trim();

            let name = withoutBullet;
            let path: string | undefined;

            if (withoutBullet.includes(':')) {
                const [namePart, ...rest] = withoutBullet.split(':');
                name = namePart.trim();
                path = rest.join(':').trim() || undefined;
            } else if (withoutBullet.includes('->')) {
                const [namePart, ...rest] = withoutBullet.split('->');
                name = namePart.trim();
                path = rest.join('->').trim() || undefined;
            } else if (withoutBullet.includes('-')) {
                const [namePart, ...rest] = withoutBullet.split('-');
                name = namePart.trim();
                path = rest.join('-').trim() || undefined;
            }

            return {
                name,
                path
            };
        })
        .filter(item => item.name);
};

type ExplanationBlock =
    | { type: 'heading'; content: string }
    | { type: 'paragraph'; content: string }
    | { type: 'list'; content: string[] };

const sanitizeInlineMarkdown = (value: string) =>
    value.replace(/\*\*/g, '').replace(/`/g, '').trim();

const buildExplanationBlocks = (text?: string): ExplanationBlock[] => {
    if (!text) return [];

    const lines = text.split(/\r?\n/).map(line => line.trim());
    const blocks: ExplanationBlock[] = [];
    let listBuffer: string[] = [];

    const flushList = () => {
        if (listBuffer.length) {
            blocks.push({ type: 'list', content: listBuffer });
            listBuffer = [];
        }
    };

    for (const rawLine of lines) {
        if (!rawLine) {
            flushList();
            continue;
        }

        const headingMatch = rawLine.match(/^\*\*(.+)\*\*$/);
        if (headingMatch) {
            flushList();
            blocks.push({ type: 'heading', content: sanitizeInlineMarkdown(headingMatch[1]) });
            continue;
        }

        if (/^(\d+\.)\s+/.test(rawLine) || /^[-*•]\s+/.test(rawLine)) {
            const cleaned = sanitizeInlineMarkdown(
                rawLine.replace(/^(\d+\.)\s+/, '').replace(/^[-*•]\s+/, '')
            );
            if (cleaned) {
                listBuffer.push(cleaned);
            }
            continue;
        }

        flushList();
        blocks.push({ type: 'paragraph', content: sanitizeInlineMarkdown(rawLine) });
    }

    flushList();
    return blocks;
};

interface RepoExplanationClientProps {
    repository: Repository;
    initialIsSaved?: boolean;
}

export default function RepoExplanationClient({ repository, initialIsSaved = false }: RepoExplanationClientProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaved, setIsSaved] = useState(initialIsSaved);
    const [isSaving, setIsSaving] = useState(false);
    const [aiData, setAiData] = useState<any>(null);
    const [zoomingEnabled, setZoomingEnabled] = useState(true);
    const [loadingStep, setLoadingStep] = useState(0);
    const componentMap = useMemo(() => parseComponentMapping(aiData?.componentMapping), [aiData?.componentMapping]);

    // Simulate progress steps
    useEffect(() => {
        if (!isAnalyzing) {
            setLoadingStep(0);
            return;
        }

        const timers = [
            setTimeout(() => setLoadingStep(1), 2500),  // Fetching -> Analyzing
            setTimeout(() => setLoadingStep(2), 8000),  // Analyzing -> Generating
            setTimeout(() => setLoadingStep(3), 18000), // Generating -> Creating
        ];

        return () => timers.forEach(clearTimeout);
    }, [isAnalyzing]);
    const hasExplanation = Boolean(aiData?.explanation && aiData.explanation.trim().length > 0);
    const hasComponentMap = componentMap.length > 0;
    const defaultInsightTab = hasExplanation ? 'explanation' : 'components';
    const explanationBlocks = useMemo(() => buildExplanationBlocks(aiData?.explanation), [aiData?.explanation]);

    // Fetch existing analysis on mount
    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!repository?.id) {
                console.log('RepoExplanationClient: No repository ID available for fetch');
                return;
            }

            console.log('RepoExplanationClient: Fetching existing analysis for repo:', repository.id);
            try {
                const response = await fetch(`/api/repositories/analysis?repositoryId=${repository.id}`);
                console.log('RepoExplanationClient: Fetch response status:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('RepoExplanationClient: Fetch data received:', data);

                    if (data.analysis) {
                        console.log('RepoExplanationClient: Setting AI data from DB');
                        setAiData({
                            mermaidChart: data.analysis.mermaid_code,
                            explanation: data.analysis.explanation,
                            componentMapping: data.analysis.component_mapping,
                            summary: data.analysis.summary
                        });
                    } else {
                        console.log('RepoExplanationClient: No analysis found in DB response');
                    }
                } else {
                    console.error('RepoExplanationClient: Fetch failed with status:', response.status);
                }
            } catch (error) {
                console.error('RepoExplanationClient: Error fetching existing analysis:', error);
            }
        };

        fetchAnalysis();
    }, [repository?.id]);

    const handleAnalyzeRepository = async () => {
        setIsAnalyzing(true);
        setLoadingStep(0);

        try {
            console.log('Starting repository analysis for:', repository.html_url);
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Analysis request timed out after 60 seconds')), 60000);
            });

            // Race the analysis against the timeout
            const result = await Promise.race([
                gitdiagramStyleAnalysis({
                    repoUrl: repository.html_url,
                    techStack: repository.language ? [repository.language] : [],
                    goal: 'Analyze repository architecture and generate interactive flowchart'
                }),
                timeoutPromise
            ]) as any;

            console.log('Analysis completed. Result structure:', {
                hasMermaidChart: !!result.mermaidChart,
                mermaidChartLength: result.mermaidChart?.length,
                explanationLength: result.explanation?.length,
                componentMapping: result.componentMapping?.length
            });

            if (!result.mermaidChart) {
                console.warn('No mermaid chart was generated in the result');
            } else {
                console.log('Mermaid chart preview (first 500 chars):', result.mermaidChart.substring(0, 500));
            }

            setAiData(result);

            // Save the analysis result
            try {
                await fetch('/api/repositories/analysis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        repositoryId: repository.id,
                        fullName: repository.full_name,
                        repositoryData: repository,
                        mermaidCode: result.mermaidChart,
                        explanation: result.explanation,
                        componentMapping: result.componentMapping,
                        summary: result.summary
                    })
                });
            } catch (saveError) {
                console.error('Error saving analysis:', saveError);
            }

        } catch (error) {
            console.error('Error analyzing repository:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

            setAiData({
                error: `Failed to analyze repository: ${errorMessage}`,
                mermaidChart: `graph TD
    A[Analysis Error] --> B[${errorMessage.replace(/[^\w\s]/g, ' ').substring(0, 50)}...]
    style A fill:#f87171,stroke:#ef4444,color:#ffffff,stroke-width:2px
    style B fill:#fecaca,stroke:#f87171,color:#7f1d1d,stroke-width:1px`,
                explanation: `Analysis failed with error: ${errorMessage}\n\nPlease check the repository URL and try again.`,
                componentMapping: 'No components could be mapped due to analysis error',
                summary: 'Analysis failed. Please try again or check the repository URL.'
            });
        } finally {
            setIsAnalyzing(false);
        };
    };

    const handleToggleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            const response = await fetch('/api/repositories/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repositoryId: repository.id })
            });

            if (response.ok) {
                const data = await response.json();
                setIsSaved(data.saved);
            }
        } catch (error) {
            console.error('Error toggling save:', error);
        } finally {
            setIsSaving(false);
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
                        variant={isSaved ? "secondary" : "outline"}
                        onClick={handleToggleSave}
                        disabled={isSaving}
                    >
                        {isSaved ? (
                            <>
                                <BookmarkCheck className="mr-2 h-4 w-4 text-yellow-500" />
                                Saved
                            </>
                        ) : (
                            <>
                                <Bookmark className="mr-2 h-4 w-4" />
                                Save
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleAnalyzeRepository}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {aiData ? 'Update Analysis' : 'Explain with OpenRepo'}
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

            {/* AI Analysis Section */}
            {isAnalyzing ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            Analyzing Repository Architecture
                        </CardTitle>
                        <CardDescription>
                            OpenRepo AI is analyzing the repository structure and generating flowchart...
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            {[
                                "Fetching repository structure...",
                                "Analyzing code components...",
                                "Generating architecture insights...",
                                "Creating interactive flowchart..."
                            ].map((step, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    {index < loadingStep ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : index === loadingStep ? (
                                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-slate-200 dark:text-slate-700" />
                                    )}
                                    <span className={`text-sm ${index === loadingStep ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : aiData ? (
                <div className="space-y-4">
                    {aiData.error && (
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Analysis Error</AlertTitle>
                            <AlertDescription>{aiData.error}</AlertDescription>
                        </Alert>
                    )}

                    <Card className="w-full flex flex-col" style={{ minHeight: '600px' }}>
                        <CardHeader className="border-b bg-gray-50">
                            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Target className="h-5 w-5 text-blue-600" />
                                        Architecture Flowchart
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        Interactive visualization of repository architecture and component relationships
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="hidden sm:flex items-center space-x-1 text-sm text-muted-foreground">
                                        <span>Zoom</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setZoomingEnabled(!zoomingEnabled)}
                                            className="h-8 w-8"
                                            title={zoomingEnabled ? 'Disable zooming' : 'Enable zooming'}
                                        >
                                            {zoomingEnabled ? (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                                </svg>
                                            )}
                                        </Button>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAnalyzeRepository()}
                                        className="h-8 text-xs"
                                    >
                                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                                        Regenerate
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1" style={{ minHeight: '550px' }}>
                            <div className="w-full h-full bg-white dark:bg-slate-950/20">
                                <EnhancedMermaidChart
                                    chart={aiData.mermaidChart || `graph TD
    A[Repository Analysis] --> B[Architecture Overview]
    B --> C[Component Structure]
    C --> D[Data Flow]
    D --> E[Dependencies]
    
    classDef default fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    class A,B,C,D,E default`}
                                    zoomingEnabled={zoomingEnabled}
                                    className="h-full"
                                />
                            </div>
                            {(hasExplanation || hasComponentMap) && (
                                <div className="border-t bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900/40 dark:via-slate-900/10 dark:to-slate-900/40 px-6 py-6 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div>
                                            <p className="text-base font-semibold text-foreground">Architecture Context</p>
                                            <p className="text-xs text-muted-foreground">
                                                Review the AI-generated explanation and component-to-file mapping that inform this diagram.
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-xs uppercase tracking-wider">
                                            AI generated
                                        </Badge>
                                    </div>
                                    <Tabs defaultValue={defaultInsightTab} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 gap-2 bg-transparent p-0">
                                            <TabsTrigger
                                                value="explanation"
                                                disabled={!hasExplanation}
                                                className="rounded-lg border text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                                            >
                                                Explanation
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="components"
                                                disabled={!hasComponentMap}
                                                className="rounded-lg border text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                                            >
                                                Components {hasComponentMap ? `(${componentMap.length})` : ''}
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="explanation" className="mt-4">
                                            {hasExplanation ? (
                                                <div className="rounded-xl border bg-white/70 dark:bg-slate-900/40 p-4 shadow-sm space-y-3">
                                                    {explanationBlocks.length ? (
                                                        explanationBlocks.map((block, index) => {
                                                            if (block.type === 'heading') {
                                                                return (
                                                                    <p key={`heading-${index}`} className="text-sm font-semibold text-foreground">
                                                                        {block.content}
                                                                    </p>
                                                                );
                                                            }

                                                            if (block.type === 'list') {
                                                                return (
                                                                    <ul key={`list-${index}`} className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                                                        {block.content.map((item, itemIndex) => (
                                                                            <li key={`list-${index}-${itemIndex}`}>{item}</li>
                                                                        ))}
                                                                    </ul>
                                                                );
                                                            }

                                                            return (
                                                                <p key={`paragraph-${index}`} className="text-sm text-muted-foreground leading-relaxed">
                                                                    {block.content}
                                                                </p>
                                                            );
                                                        })
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">No explanation available for this analysis.</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No explanation available for this analysis.</p>
                                            )}
                                        </TabsContent>
                                        <TabsContent value="components" className="mt-4">
                                            {hasComponentMap ? (
                                                <div className="grid gap-3 max-h-72 overflow-y-auto pr-1">
                                                    {componentMap.map((item, idx) => (
                                                        <div
                                                            key={`${item.name}-${idx}`}
                                                            className="rounded-lg border bg-white/80 dark:bg-slate-900/40 p-3 shadow-sm"
                                                        >
                                                            <p className="text-sm font-semibold text-foreground">{item.name}</p>
                                                            {item.path ? (
                                                                <p className="text-xs text-muted-foreground mt-1 font-mono break-all">{item.path}</p>
                                                            ) : (
                                                                <p className="text-xs text-muted-foreground mt-1">Path not specified</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No component mapping was generated.</p>
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Ready for AI Analysis</h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                            Click "Explain with OpenRepo" to generate an interactive flowchart of this repository
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
