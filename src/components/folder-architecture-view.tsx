"use client";

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Code, 
  Database, 
  Globe, 
  Server, 
  Cpu, 
  Users,
  Zap,
  Shield,
  TrendingUp,
  Settings,
  GitBranch,
  Network,
  Box,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Eye,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import type { DynamicArchitectureAnalysisOutput } from '@/ai/flows/dynamic-architecture-analysis';
import type { Repository } from '@/lib/types';

interface FolderArchitectureViewProps {
  analysisData: DynamicArchitectureAnalysisOutput;
  repository: Repository;
}

interface FolderNode {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: FolderNode[];
  description: string;
  purpose: string;
  keyComponents: string[];
  technologies: string[];
  complexity: 'low' | 'medium' | 'high';
  filesCount: number;
  layer?: number;
}

export default function FolderArchitectureView({ analysisData, repository }: FolderArchitectureViewProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const { flowchartData } = analysisData;

  // Define helper functions before useMemo to avoid initialization errors
  const getFolderDescription = (folderName: string, path: string, folderNode: FolderNode): string => {
    // Use AI-generated insights to create dynamic descriptions
    const { architectureInsights, analysisSummary } = analysisData;
    
    // Analyze the folder's content based on its files and technologies
    const technologies = folderNode.technologies;
    const keyComponents = folderNode.keyComponents;
    const complexity = folderNode.complexity;
    const layer = folderNode.layer;
    
    // Generate description based on folder content and architecture insights
    let description = '';
    
    // Base description on folder name and content analysis
    if (technologies.length > 0) {
      const primaryTech = technologies[0];
      if (primaryTech === 'typescript' || primaryTech === 'javascript') {
        description = `${folderName} directory containing ${primaryTech} modules`;
      } else if (primaryTech === 'python') {
        description = `${folderName} directory with Python modules and scripts`;
      } else if (primaryTech === 'java') {
        description = `${folderName} directory with Java classes and packages`;
      } else {
        description = `${folderName} directory with ${primaryTech} components`;
      }
    } else {
      description = `${folderName} directory containing related files and modules`;
    }
    
    // Add technology stack context
    if (technologies.length > 1) {
      description += ` using ${technologies.slice(0, 3).join(', ')}`;
      if (technologies.length > 3) {
        description += ` and ${technologies.length - 3} more technologies`;
      }
    }
    
    // Add complexity context
    if (complexity === 'high') {
      description += ' with high complexity';
    } else if (complexity === 'medium') {
      description += ' with moderate complexity';
    }
    
    // Add layer context if available
    if (layer !== undefined) {
      const layerNames = ['Entry', 'Presentation', 'Business Logic', 'Data', 'Infrastructure'];
      const layerName = layerNames[layer] || `Layer ${layer}`;
      description += ` (${layerName} layer)`;
    }
    
    // Add component count context
    if (keyComponents.length > 0) {
      description += ` containing ${keyComponents.length} key components`;
    }
    
    // Add architecture insights context if available
    if (architectureInsights) {
      if (architectureInsights.scalability && folderName === 'api' || folderName === 'services') {
        description += ' designed for scalability';
      }
      if (architectureInsights.security && (folderName === 'auth' || folderName === 'security')) {
        description += ' with security focus';
      }
      if (architectureInsights.performance && (folderName === 'utils' || folderName === 'lib')) {
        description += ' optimized for performance';
      }
    }
    
    return description;
  };

  const getFolderPurpose = (folderName: string, path: string, folderNode: FolderNode): string => {
    // Use AI-generated insights to create dynamic purposes
    const { architectureInsights, analysisSummary } = analysisData;
    
    // Analyze the folder's content based on its files and technologies
    const technologies = folderNode.technologies;
    const keyComponents = folderNode.keyComponents;
    const complexity = folderNode.complexity;
    const layer = folderNode.layer;
    
    // Generate purpose based on folder content and architecture insights
    let purpose = '';
    
    // Base purpose on folder name and content analysis
    if (folderName === 'src' || folderName === 'source') {
      purpose = `Contains the main source code organized by functionality and modules`;
    } else if (folderName === 'components') {
      purpose = `Provides reusable UI components with ${technologies.join(', ')} technologies`;
    } else if (folderName === 'lib' || folderName === 'utils') {
      purpose = `Offers utility functions and shared libraries used across ${keyComponents.length} components`;
    } else if (folderName === 'api' || folderName === 'services') {
      purpose = `Handles ${technologies[0] || 'API'} communications and business logic operations`;
    } else if (folderName === 'tests' || folderName === '__tests__') {
      purpose = `Ensures code quality through comprehensive testing of ${keyComponents.length} modules`;
    } else if (folderName === 'config') {
      purpose = `Manages configuration settings and environment-specific parameters`;
    } else if (folderName === 'types') {
      purpose = `Defines TypeScript interfaces and types for type safety across the application`;
    } else if (folderName === 'hooks') {
      purpose = `Implements custom React hooks for state management and side effects`;
    } else if (folderName === 'styles') {
      purpose = `Manages CSS styling and theme configuration for consistent UI appearance`;
    } else if (folderName === 'pages' || folderName === 'app') {
      purpose = `Implements page-level components and routing logic for navigation`;
    } else {
      // Generic purpose based on analysis
      purpose = `Contains ${keyComponents.length} modules and components using ${technologies.join(', ')} technologies`;
    }
    
    // Add layer-specific purpose
    if (layer !== undefined) {
      const layerDescriptions = [
        'serves as the entry point for the application',
        'handles user interface and presentation logic',
        'implements business rules and application logic',
        'manages data storage and retrieval operations',
        'provides infrastructure and external service integrations'
      ];
      purpose += ` and ${layerDescriptions[layer] || 'operates at an unspecified layer'}`;
    }
    
    // Add complexity context
    if (complexity === 'high') {
      purpose += ' with complex interactions and dependencies';
    } else if (complexity === 'medium') {
      purpose += ' with moderate complexity and clear structure';
    } else {
      purpose += ' with simple and straightforward implementation';
    }
    
    // Incorporate architecture insights if available
    if (architectureInsights && architectureInsights.designPatterns) {
      const relevantPatterns = architectureInsights.designPatterns.slice(0, 2);
      if (relevantPatterns.length > 0) {
        purpose += ` following ${relevantPatterns.join(' and ')} patterns`;
      }
    }
    
    return purpose;
  };

  const folderStructure = useMemo(() => {
    const nodes = flowchartData.nodes;
    const folderMap = new Map<string, FolderNode>();
    
    // Group nodes by folder paths
    nodes.forEach((node: any) => {
      if (node.filePath) {
        const pathParts = node.filePath.split('/');
        let currentPath = '';
        
        // Create folder structure
        for (let i = 0; i < pathParts.length - 1; i++) {
          const folderName = pathParts[i];
          currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;
          
          if (!folderMap.has(currentPath)) {
            const folderNode: FolderNode = {
              id: `folder-${currentPath}`,
              name: folderName,
              path: currentPath,
              type: 'folder',
              description: getFolderDescription(folderName, currentPath, {
                id: `folder-${currentPath}`,
                name: folderName,
                path: currentPath,
                type: 'folder',
                children: [],
                description: '',
                purpose: '',
                keyComponents: [],
                technologies: [],
                complexity: 'medium',
                filesCount: 0,
                layer: node.layer
              }),
              purpose: getFolderPurpose(folderName, currentPath, {
                id: `folder-${currentPath}`,
                name: folderName,
                path: currentPath,
                type: 'folder',
                children: [],
                description: '',
                purpose: '',
                keyComponents: [],
                technologies: [],
                complexity: 'medium',
                filesCount: 0,
                layer: node.layer
              }),
              keyComponents: [],
              technologies: [],
              complexity: 'medium',
              filesCount: 0,
              layer: node.layer,
              children: []
            };
            folderMap.set(currentPath, folderNode);
          }
        }
        
        // Add file to the parent folder
        const parentFolder = currentPath || 'root';
        if (folderMap.has(parentFolder)) {
          const folder = folderMap.get(parentFolder)!;
          folder.keyComponents.push(node.label);
          folder.filesCount++;
          folder.technologies.push(node.metadata.language || 'unknown');
        }
      }
    });
    
    // Update folder descriptions and purposes with actual data
    folderMap.forEach(folder => {
      // Remove duplicate technologies
      folder.technologies = Array.from(new Set(folder.technologies));
      
      // Update complexity based on files count and technologies
      if (folder.filesCount > 10 || folder.technologies.length > 3) {
        folder.complexity = 'high';
      } else if (folder.filesCount > 5 || folder.technologies.length > 1) {
        folder.complexity = 'medium';
      } else {
        folder.complexity = 'low';
      }
      
      // Update description and purpose with real data
      folder.description = getFolderDescription(folder.name, folder.path, folder);
      folder.purpose = getFolderPurpose(folder.name, folder.path, folder);
    });
    
    // Build hierarchy
    const rootFolders: FolderNode[] = [];
    folderMap.forEach(folder => {
      const pathParts = folder.path.split('/');
      if (pathParts.length === 1) {
        rootFolders.push(folder);
      } else {
        const parentPath = pathParts.slice(0, -1).join('/');
        const parent = folderMap.get(parentPath);
        if (parent && parent.children) {
          parent.children.push(folder);
        }
      }
    });
    
    return rootFolders;
  }, [flowchartData]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev: Set<string>) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'medium': return <TrendingUp className="w-4 h-4 text-yellow-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getFolderIcon = (folderName: string, isExpanded: boolean) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'src': Code,
      'components': Users,
      'lib': Box,
      'utils': Settings,
      'hooks': Zap,
      'services': Server,
      'api': Network,
      'pages': FileText,
      'app': Globe,
      'styles': Eye,
      'types': FileText,
      'config': Settings,
      'tests': Shield,
      'docs': FileText,
      'assets': Folder,
      'public': Globe,
      'database': Database,
      'models': Database,
      'schemas': Database,
      'auth': Shield,
      'security': Shield,
      'store': Database,
      'controllers': Cpu,
      'routes': GitBranch,
      'middleware': Server,
      'layouts': Users,
      'contexts': Cpu,
      'prisma': Database,
      'drizzle': Database,
      'supabase': Database,
      'docker': Server,
      'kubernetes': Server,
      'aws': Server,
      'gcp': Server,
      'azure': Server,
      'firebase': Server,
      'stripe': Zap,
      'paypal': Zap,
      'twilio': Zap,
      'analytics': TrendingUp,
      'monitoring': TrendingUp,
      'performance': TrendingUp,
      'logging': FileText,
      'caching': Database,
      'queue': Server,
      'websocket': Network,
      'email': Zap,
      'storage': Database,
      'images': Eye,
      'pdf': FileText,
      'csv': FileText,
      'json': FileText,
      'xml': FileText,
      'yaml': FileText,
      'env': Settings,
      'ci': Server,
      'cd': Server,
      'github': GitBranch,
      'vercel': Server,
      'netlify': Server,
      'i18n': Globe,
      'themes': Eye,
      'animations': Zap,
      'transitions': Zap,
      'modals': Users,
      'forms': Users,
      'tables': Users,
      'charts': TrendingUp,
      'maps': Globe,
      'calendar': FileText,
      'date': FileText,
      'math': Cpu,
      'crypto': Shield,
      'compression': Box,
      'encryption': Shield,
      'hashing': Shield,
      'validation': Shield,
      'sanitization': Shield,
      'normalization': Box,
      'serialization': Box,
      'deserialization': Box
    };
    
    const IconComponent = iconMap[folderName.toLowerCase()] || (isExpanded ? FolderOpen : Folder);
    return <IconComponent className="w-5 h-5" />;
  };

  const renderFolder = (folder: FolderNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = folder.children && folder.children.length > 0;
    
    return (
      <div key={folder.id} className="space-y-2">
        <Card className={`transition-all duration-200 hover:shadow-md ${level > 0 ? 'ml-6' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFolder(folder.id)}
                  className="p-1 h-auto"
                >
                  {hasChildren ? (
                    isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </Button>
                <div className="flex items-center gap-2">
                  {getFolderIcon(folder.name, isExpanded)}
                  <span className="font-semibold text-lg">{folder.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {folder.filesCount} files
                  </Badge>
                  {folder.technologies.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {folder.technologies[0]}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getComplexityIcon(folder.complexity)}
                <Badge variant="outline" className={getComplexityColor(folder.complexity)}>
                  {folder.complexity}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Description</h4>
                <p className="text-sm">{folder.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Purpose</h4>
                <p className="text-sm">{folder.purpose}</p>
              </div>
              {folder.keyComponents.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Key Components</h4>
                  <div className="flex flex-wrap gap-1">
                    {folder.keyComponents.slice(0, 5).map((component, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {component}
                      </Badge>
                    ))}
                    {folder.keyComponents.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{folder.keyComponents.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              {folder.technologies.length > 1 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(new Set(folder.technologies)).slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {folder.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{folder.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {hasChildren && isExpanded && (
          <div className="space-y-2">
            {folder.children!.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Folder Architecture
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {repository.full_name}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Interactive exploration of the repository's folder structure with detailed explanations
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Folders</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{folderStructure.length}</div>
            <p className="text-xs text-muted-foreground">
              Root directories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flowchartData.nodes.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all folders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technologies</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.from(new Set(flowchartData.nodes.map((n: any) => n.metadata.language))).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Programming languages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Architecture</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(flowchartData.layers).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Architecture layers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Folder Structure */}
      <div className="space-y-4">
        {folderStructure.length > 0 ? (
          folderStructure.map(folder => renderFolder(folder))
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <Folder className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">No folders found</h3>
                <p className="text-sm text-muted-foreground">
                  The repository structure could not be analyzed. Please check if the repository contains valid source files.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
