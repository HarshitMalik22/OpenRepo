"use client";

import { useState, useEffect } from 'react';
import type { Repository } from '@/lib/types';
import { renderInteractiveFlowchart, type RenderInteractiveFlowchartOutput } from '@/ai/flows/render-interactive-flowchart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Video, BookOpen, FileCode, AlertTriangle, BrainCircuit, ExternalLink } from 'lucide-react';
import FlowchartRenderer from '@/components/flowchart-renderer';
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
                // Get user goal from local storage
                const storedPrefs = localStorage.getItem('userPreferences');
                const userGoal = storedPrefs ? JSON.parse(storedPrefs).goal || 'Understand Architecture' : 'Understand Architecture';

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
                            View on GitHub <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
                <div className="border-t border-dashed border-border pt-8">
                    <p className="text-center text-muted-foreground">Click the button above to generate an AI-powered explanation of this repository.</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error || !aiData) {
        return (
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Generating Explanation</AlertTitle>
                <AlertDescription>
                    {error || "The AI model could not provide an explanation for this repository. Please try again later."}
                </AlertDescription>
            </Alert>
        );
    }
    
    return (
        <Tabs defaultValue="flowchart" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
                <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
                <TabsTrigger value="modules">Code Modules</TabsTrigger>
                <TabsTrigger value="resources">Study Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="flowchart" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Architecture Flowchart</CardTitle>
                        <CardDescription>An AI-generated visual guide to the repository's structure.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FlowchartRenderer chart={aiData.flowchartMermaid} />
                        {aiData.explanation && aiData.explanation.length > 0 && (
                             <Accordion type="single" collapsible className="w-full mt-4">
                                {aiData.explanation.map((item) => (
                                    <AccordionItem value={item.component} key={item.component}>
                                        <AccordionTrigger>{item.component}</AccordionTrigger>
                                        <AccordionContent>{item.description}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="modules" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Key Components</CardTitle>
                        <CardDescription>AI-generated explanation of the repository's main components.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {aiData?.explanation?.map((item, index) => (
                                <AccordionItem value={item.component} key={index}>
                                    <AccordionTrigger>{item.component}</AccordionTrigger>
                                    <AccordionContent>{item.description}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        {(!aiData?.explanation || aiData.explanation.length === 0) && (
                            <p className="text-muted-foreground">Component explanations not available for this repository.</p>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">AI-Curated Study Resources</CardTitle>
                        <CardDescription>Learning materials related to this project's tech stack.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {aiData?.resources?.map((resource, index) => (
                            <a href={resource.url} key={index} target="_blank" rel="noopener noreferrer" className="block">
                                <Card className="h-full hover:border-primary transition-colors">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        {getResourceIcon(resource.type)}
                                        <CardTitle className="text-lg leading-snug">{resource.title}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </a>
                        ))}
                        {(!aiData?.resources || aiData.resources.length === 0) && (
                            <div className="col-span-full text-center text-muted-foreground">
                                Learning resources not available for this repository.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
      </Tabs>
    )
}
