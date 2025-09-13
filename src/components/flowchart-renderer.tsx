"use client";

import { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { Skeleton } from '@/components/ui/skeleton';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  darkMode: true,
  securityLevel: 'loose',
  themeVariables: {
    background: '#1A202C',
    primaryColor: '#2d3748',
    primaryTextColor: '#E2E8F0',
    lineColor: '#A78BFA',
    textColor: '#E2E8F0',
    nodeBorder: '#A78BFA',
  }
});

interface FlowchartRendererProps {
  chart: string;
}

export default function FlowchartRenderer({ chart }: FlowchartRendererProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAndCleanMermaid = (mermaidCode: string): string => {
    try {
      // Basic validation and cleaning
      let cleanedCode = mermaidCode.trim();
      
      // Remove problematic characters and ensure proper formatting
      cleanedCode = cleanedCode
        .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
        .replace(/["'`]/g, '') // Remove quotes that can break parsing
        .replace(/[\u201C\u201D\u2018\u2019]/g, '') // Remove smart quotes
        .replace(/\.{2,}/g, '...') // Fix multiple dots
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      // Ensure the diagram starts with a valid type
      const validTypes = ['graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram', 'erDiagram', 'journey', 'gantt', 'pie', 'gitgraph'];
      const firstLine = cleanedCode.split('\n')[0].trim();
      
      if (!validTypes.some(type => firstLine.startsWith(type))) {
        // If it doesn't start with a valid type, default to graph TD
        cleanedCode = `graph TD\n${cleanedCode}`;
      }
      
      // Fix common syntax issues
      cleanedCode = cleanedCode
        .replace(/\[([^\]]+)\];subgraph/g, '[$1]\nsubgraph') // Fix missing line breaks
        .replace(/subgraph\s+([^\n]+)\s*\[/g, 'subgraph $1 [') // Fix subgraph syntax
        .replace(/\]\s*end/g, ']\nend') // Fix subgraph ending
        .replace(/;\s*;/g, ';') // Remove double semicolons
        .replace(/\n\s*\n/g, '\n') // Remove empty lines
        .replace(/-->\s*"([^"]+)"/g, '--> $1') // Remove quotes from arrow labels
        .replace(/\["([^"]+)"\]/g, '[$1]') // Remove quotes from node labels
        .replace(/\["([^"]+)"\]/g, '[$1]') // Remove quotes from node labels (second pass)
        .replace(/\[([^\]]+)\] -- "([^"]+)" -->/g, '[$1] -->') // Remove complex arrow labels
        .replace(/\[([^\]]+)\] -- ([^\-]+) -->/g, '[$1] -->') // Remove arrow labels
        .replace(/\bPS\b/g, 'Process') // Replace problematic PS identifier
        .replace(/\bSQE\b/g, 'Quality') // Replace problematic SQE identifier
        .replace(/\bPE\b/g, 'Process') // Replace problematic PE identifier
        .replace(/\b-\)\b/g, 'End') // Replace problematic -) identifier
        .trim();
      
      // Ensure proper line breaks and structure
      const lines = cleanedCode.split('\n');
      const validLines = lines.filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && !trimmed.includes('-->') && trimmed !== 'graph TD';
      });
      
      if (validLines.length === 0) {
        // If no valid lines, create a simple structure
        return 'graph TD\n    A[Repository] --> B[Components]\n    B --> C[Modules]';
      }
      
      // Rebuild with proper formatting
      let finalCode = 'graph TD';
      validLines.forEach((line, index) => {
        const cleanLine = line.trim()
          .replace(/^\d+\.?\s*/, '') // Remove numbering
          .replace(/^[-*•]\s*/, '') // Remove bullet points
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim();
          
        if (cleanLine.length > 0) {
          // Create simple node connections
          const nodeId = String.fromCharCode(65 + index); // A, B, C, etc.
          const nodeLabel = cleanLine.length > 30 ? cleanLine.substring(0, 30) + '...' : cleanLine;
          finalCode += `\n    ${nodeId}[${nodeLabel}]`;
          
          if (index > 0) {
            const prevNodeId = String.fromCharCode(65 + index - 1);
            finalCode += `\n    ${prevNodeId} --> ${nodeId}`;
          }
        }
      });
      
      return finalCode;
    } catch (e) {
      console.error('Error cleaning Mermaid code:', e);
      return 'graph TD\n    A[Repository] --> B[Components]\n    B --> C[Modules]';
    }
  };

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        if (!chart || chart.trim().length === 0) {
          throw new Error('Empty chart data');
        }
        
        const cleanedChart = validateAndCleanMermaid(chart);
        
        // Test if the chart is valid by trying to parse it
        try {
          await mermaid.parse(cleanedChart);
        } catch (parseError) {
          console.error('Mermaid parse error:', parseError);
          // Try to create a simple fallback chart
          const fallbackChart = `graph TD\n    A[Repository] --> B[Components]\n    B --> C[Modules]\n    C --> D[Files]`;
          const { svg: fallbackSvg } = await mermaid.render('mermaid-chart-fallback', fallbackChart);
          if (isMounted) {
            setSvg(fallbackSvg);
            setError('The AI-generated flowchart had syntax issues. Showing a simplified version instead.');
          }
          return;
        }
        
        const { svg: renderedSvg } = await mermaid.render('mermaid-chart', cleanedChart);
        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (e: any) {
        if (isMounted) {
          const errorMessage = e.message || 'Failed to render flowchart';
          setError(`Failed to render flowchart: ${errorMessage}`);
          console.error('Flowchart render error:', e);
          
          // Create a simple fallback chart
          try {
            const fallbackChart = `graph TD\n    A[Repository] --> B[Components]\n    B --> C[Modules]\n    C --> D[Files]`;
            const { svg: fallbackSvg } = await mermaid.render('mermaid-chart-fallback', fallbackChart);
            setSvg(fallbackSvg);
          } catch (fallbackError) {
            console.error('Fallback chart also failed:', fallbackError);
          }
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error && !svg) {
    return (
      <div className="space-y-4">
        <div className="text-destructive p-4 border border-destructive rounded-md">
          <p className="font-medium">Flowchart Rendering Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
        <div className="text-muted-foreground text-sm">
          <p>The AI may have generated invalid Mermaid syntax. This can happen with complex repository structures.</p>
        </div>
      </div>
    );
  }

  if (!svg) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 p-3 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm">
          ⚠️ {error}
        </div>
      )}
      <div className="p-4 bg-card rounded-lg flex justify-center items-center overflow-auto" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
