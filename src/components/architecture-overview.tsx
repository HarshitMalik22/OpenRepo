"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layers, 
  GitBranch, 
  Database, 
  Server, 
  Code, 
  Zap, 
  Shield, 
  TrendingUp,
  Users,
  FileText,
  Box,
  Network,
  Cpu,
  Globe
} from 'lucide-react';
import type { DynamicArchitectureAnalysisOutput } from '@/ai/flows/dynamic-architecture-analysis';
import type { Repository } from '@/lib/types';

interface ArchitectureOverviewProps {
  analysisData: DynamicArchitectureAnalysisOutput;
  repository: Repository;
}

export default function ArchitectureOverview({ analysisData, repository }: ArchitectureOverviewProps) {
  const { flowchartData, architectureInsights, analysisSummary } = analysisData;

  // Calculate architecture statistics
  const stats = useMemo(() => {
    const nodes = flowchartData?.nodes || [];
    const connections = flowchartData?.connections || [];
    
    const layerCounts = {
      entry: nodes.filter(n => n.layer === 0).length,
      presentation: nodes.filter(n => n.layer === 1).length,
      business: nodes.filter(n => n.layer === 2).length,
      data: nodes.filter(n => n.layer === 3).length,
      infrastructure: nodes.filter(n => n.layer === 4).length
    };

    const complexityDistribution = {
      low: nodes.filter(n => n.complexity < 0.3).length,
      medium: nodes.filter(n => n.complexity >= 0.3 && n.complexity < 0.7).length,
      high: nodes.filter(n => n.complexity >= 0.7).length
    };

    const languageDistribution = nodes.reduce((acc, node) => {
      const language = node.metadata?.language || 'Unknown';
      acc[language] = (acc[language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalNodes: nodes.length,
      totalConnections: connections.length,
      layerCounts,
      complexityDistribution,
      languageDistribution,
      averageComplexity: flowchartData?.metrics?.averageComplexity || 0,
      coupling: flowchartData?.metrics?.coupling || 0,
      cohesion: flowchartData?.metrics?.cohesion || 0
    };
  }, [flowchartData]);

  const getComplexityColor = (complexity: number) => {
    if (complexity < 0.3) return 'bg-green-100 text-green-800 border-green-200';
    if (complexity < 0.7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getLayerIcon = (layerName: string) => {
    switch (layerName) {
      case 'entry': return <Globe className="w-5 h-5" />;
      case 'presentation': return <Users className="w-5 h-5" />;
      case 'business': return <Cpu className="w-5 h-5" />;
      case 'data': return <Database className="w-5 h-5" />;
      case 'infrastructure': return <Server className="w-5 h-5" />;
      default: return <Box className="w-5 h-5" />;
    }
  };

  const renderArchitectureDiagram = () => (
    <div className="relative w-full h-96 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-5 grid-rows-5 h-full w-full">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="border border-slate-300 dark:border-slate-600" />
          ))}
        </div>
      </div>

      {/* Architecture layers */}
      <div className="absolute inset-4 flex flex-col justify-between">
        {/* Entry Layer */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4 w-4/5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-800 dark:text-blue-200">Entry Layer</span>
              <Badge variant="secondary" className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                {stats.layerCounts.entry} components
              </Badge>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">API endpoints, main entry points, public interfaces</p>
          </div>
        </div>

        {/* Presentation Layer */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-4 w-4/5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-purple-800 dark:text-purple-200">Presentation Layer</span>
              <Badge variant="secondary" className="bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
                {stats.layerCounts.presentation} components
              </Badge>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300">UI components, views, controllers, user interfaces</p>
          </div>
        </div>

        {/* Business Layer */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-lg p-4 w-4/5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Cpu className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-800 dark:text-green-200">Business Layer</span>
              <Badge variant="secondary" className="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200">
                {stats.layerCounts.business} components
              </Badge>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">Business logic, services, workflows, domain models</p>
          </div>
        </div>

        {/* Data Layer */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700 rounded-lg p-4 w-4/5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Database className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <span className="font-semibold text-amber-800 dark:text-amber-200">Data Layer</span>
              <Badge variant="secondary" className="bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200">
                {stats.layerCounts.data} components
              </Badge>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300">Data access, repositories, database models, ORM</p>
          </div>
        </div>

        {/* Infrastructure Layer */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-lg p-4 w-4/5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Server className="w-6 h-6 text-red-600 dark:text-red-400" />
              <span className="font-semibold text-red-800 dark:text-red-200">Infrastructure Layer</span>
              <Badge variant="secondary" className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200">
                {stats.layerCounts.infrastructure} components
              </Badge>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300">Configuration, utilities, logging, external services</p>
          </div>
        </div>
      </div>

      {/* Connection arrows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-slate-400 dark:bg-slate-600"></div>
        <div className="absolute top-2/4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-slate-400 dark:bg-slate-600"></div>
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-slate-400 dark:bg-slate-600"></div>
        <div className="absolute top-4/4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-slate-400 dark:bg-slate-600"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Architecture Overview
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {repository.full_name}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          {analysisSummary}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Components</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNodes}</div>
            <p className="text-xs text-muted-foreground">
              Across {Object.keys(stats.layerCounts).filter(k => stats.layerCounts[k as keyof typeof stats.layerCounts] > 0).length} layers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connections</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConnections}</div>
            <p className="text-xs text-muted-foreground">
              Inter-component dependencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Complexity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.averageComplexity * 100).toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.averageComplexity < 0.3 ? 'Low' : stats.averageComplexity < 0.7 ? 'Medium' : 'High'} complexity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.languageDistribution).length}</div>
            <p className="text-xs text-muted-foreground">
              Programming languages used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="diagram" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diagram">Architecture Diagram</TabsTrigger>
          <TabsTrigger value="layers">Layer Analysis</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="diagram" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                System Architecture
              </CardTitle>
              <CardDescription>
                Visual representation of the repository's layered architecture
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderArchitectureDiagram()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layers" className="space-y-6">
          <div className="grid gap-4">
            {Object.entries(stats.layerCounts).map(([layerName, count]) => {
              if (count === 0) return null;
              
              const layerNodes = flowchartData.nodes.filter(n => n.layer === Object.keys(stats.layerCounts).indexOf(layerName));
              const avgComplexity = layerNodes.reduce((sum, node) => sum + node.complexity, 0) / layerNodes.length;
              
              return (
                <Card key={layerName}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getLayerIcon(layerName)}
                      {layerName.charAt(0).toUpperCase() + layerName.slice(1)} Layer
                      <Badge variant="outline">{count} components</Badge>
                    </CardTitle>
                    <CardDescription>
                      Average complexity: {(avgComplexity * 100).toFixed(0)}%
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Complexity Distribution:</span>
                        <div className="flex gap-2">
                          <Badge className={getComplexityColor(0.2)}>
                            Low: {layerNodes.filter(n => n.complexity < 0.3).length}
                          </Badge>
                          <Badge className={getComplexityColor(0.5)}>
                            Medium: {layerNodes.filter(n => n.complexity >= 0.3 && n.complexity < 0.7).length}
                          </Badge>
                          <Badge className={getComplexityColor(0.8)}>
                            High: {layerNodes.filter(n => n.complexity >= 0.7).length}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Languages: {layerNodes.reduce((acc, node) => {
                          acc.add(node.metadata.language);
                          return acc;
                        }, new Set<string>()).size} different languages
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4">
            {/* Design Patterns */}
            {architectureInsights?.designPatterns && architectureInsights.designPatterns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Design Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {architectureInsights.designPatterns.map((pattern: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Architecture Quality */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Architecture Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Cohesion</span>
                      <span className="text-sm font-medium">{(stats.cohesion * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${stats.cohesion * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Coupling</span>
                      <span className="text-sm font-medium">{(stats.coupling * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${stats.coupling * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium mb-1">Data Flow</h4>
                  <p className="text-sm text-muted-foreground">{architectureInsights?.dataFlow || 'No data flow information available'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Scalability</h4>
                  <p className="text-sm text-muted-foreground">{architectureInsights?.scalability || 'No scalability information available'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Performance</h4>
                  <p className="text-sm text-muted-foreground">{architectureInsights?.performance || 'No performance information available'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Security</h4>
                  <p className="text-sm text-muted-foreground">{architectureInsights?.security || 'No security information available'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
