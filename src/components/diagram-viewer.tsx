"use client";

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sparkles, 
  Download, 
  Maximize, 
  ExternalLink, 
  FileText, 
  GitBranch, 
  Settings, 
  RefreshCw,
  Copy,
  Save,
  X,
  Loader2
} from 'lucide-react';
import MermaidChart from './mermaid-diagram';
import { generateDiagram, modifyDiagram, type DiagramGenerationRequest, type DiagramGenerationResponse } from '@/lib/diagram-service';

interface DiagramViewerProps {
  initialRepoUrl?: string;
  onDiagramGenerated?: (data: DiagramGenerationResponse) => void;
  className?: string;
}

export default function DiagramViewer({ 
  initialRepoUrl = '', 
  onDiagramGenerated,
  className = '' 
}: DiagramViewerProps) {
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl);
  const [diagram, setDiagram] = useState('');
  const [explanation, setExplanation] = useState('');
  const [repository, setRepository] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [instructions, setInstructions] = useState('');
  const [showCustomization, setShowCustomization] = useState(false);
  const [zoomingEnabled, setZoomingEnabled] = useState(true);

  const parseRepoUrl = useCallback((url: string) => {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/i);
    if (match) {
      return { username: match[1], repo: match[2] };
    }
    return null;
  }, []);

  const handleGenerate = useCallback(async () => {
    const repoInfo = parseRepoUrl(repoUrl);
    if (!repoInfo) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const request: DiagramGenerationRequest = {
        username: repoInfo.username,
        repo: repoInfo.repo,
        instructions: instructions.trim() || undefined,
      };

      const result = await generateDiagram(request);
      
      if ('error' in result) {
        setError(result.error);
      } else {
        setDiagram(result.diagram);
        setExplanation(result.explanation);
        setRepository(result.repository);
        onDiagramGenerated?.(result);
      }
    } catch (err) {
      setError('Failed to generate diagram. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [repoUrl, instructions, parseRepoUrl, onDiagramGenerated]);

  const handleModify = useCallback(async () => {
    if (!diagram || !repository || !instructions.trim()) {
      setError('Please provide modification instructions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await modifyDiagram({
        username: repository.full_name.split('/')[0],
        repo: repository.full_name.split('/')[1],
        currentDiagram: diagram,
        instructions: instructions.trim(),
      });

      if ('error' in result) {
        setError(result.error);
      } else {
        setDiagram(result.diagram);
        setExplanation(result.explanation);
        setInstructions('');
        setShowCustomization(false);
      }
    } catch (err) {
      setError('Failed to modify diagram. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [diagram, repository, instructions]);

  const handleExportImage = useCallback(async () => {
    if (!diagram) return;

    try {
      // This is a simplified export - in a real implementation, you'd use html2canvas or similar
      const svgElement = document.querySelector('.mermaid svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          
          const link = document.createElement('a');
          link.download = `${repository?.name || 'diagram'}.png`;
          link.href = canvas.toDataURL();
          link.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      }
    } catch (err) {
      console.error('Failed to export image:', err);
      setError('Failed to export image. Please try again.');
    }
  }, [diagram, repository]);

  const handleCopyMermaid = useCallback(() => {
    if (!diagram) return;
    
    navigator.clipboard.writeText(diagram).then(() => {
      // You could add a toast notification here
    }).catch(err => {
      console.error('Failed to copy diagram:', err);
      setError('Failed to copy diagram to clipboard.');
    });
  }, [diagram]);

  return (
    <div className={`w-full max-w-6xl mx-auto space-y-6 ${className}`}>
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Generate Repository Diagram
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleGenerate} 
              disabled={loading || !repoUrl.trim()}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate
            </Button>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Customization Panel */}
          {showCustomization && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Customization Options</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomization(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <Textarea
                placeholder="Enter instructions to customize the diagram (e.g., 'Focus on the database layer', 'Add more detail to the frontend components', 'Simplify the architecture overview')"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={diagram ? handleModify : handleGenerate}
                  disabled={loading || !instructions.trim()}
                  size="sm"
                >
                  {diagram ? 'Modify Diagram' : 'Generate with Instructions'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setInstructions('')}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomization(!showCustomization)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {showCustomization ? 'Hide' : 'Show'} Customization
            </Button>
            
            {diagram && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomingEnabled(!zoomingEnabled)}
                >
                  <Maximize className="h-4 w-4 mr-2" />
                  {zoomingEnabled ? 'Disable' : 'Enable'} Zoom
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportImage}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyMermaid}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Mermaid
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Repository Info */}
      {repository && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Repository Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 flex-wrap">
              <h3 className="font-semibold text-lg">{repository.full_name}</h3>
              {repository.description && (
                <p className="text-gray-600">{repository.description}</p>
              )}
              <div className="flex gap-2">
                {repository.language && (
                  <Badge variant="secondary">{repository.language}</Badge>
                )}
                <Badge variant="outline">⭐ {repository.stars}</Badge>
                <Badge variant="outline">🔱 {repository.forks}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diagram Display */}
      {diagram && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Architecture Diagram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MermaidChart 
              chart={diagram} 
              zoomingEnabled={zoomingEnabled}
              className="border rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Explanation */}
      {explanation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Architecture Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">{explanation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
