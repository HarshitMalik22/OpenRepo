"use client";

import { useEffect } from 'react';
import mermaid from 'mermaid';

interface SimpleMermaidRendererProps {
  chart: string;
}

export default function SimpleMermaidRenderer({ chart }: SimpleMermaidRendererProps) {
  useEffect(() => {
    if (chart) {
      // Initialize mermaid with dark theme
      mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#1e40af',
          lineColor: '#64748b',
          secondaryColor: '#8b5cf6',
          tertiaryColor: '#06b6d4',
          clusterBkg: '#1e293b',
          clusterBorder: '#334155',
          defaultLinkColor: '#64748b',
          titleColor: '#f1f5f9',
          edgeLabelBackground: '#1e293b',
          fontSize: '14px',
        }
      });

      // Let mermaid handle the rendering naturally
      mermaid.contentLoaded();
    }
  }, [chart]);

  if (!chart) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No diagram data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-900 rounded-lg overflow-auto min-h-[500px] p-4">
      <div className="mermaid w-full h-full min-h-[400px]">
        {chart}
      </div>
    </div>
  );
}
