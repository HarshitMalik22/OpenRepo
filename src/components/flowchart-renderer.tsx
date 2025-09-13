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

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (e: any) {
        if (isMounted) {
          setError('Failed to render flowchart. Please check the Mermaid syntax.');
          console.error(e);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return <div className="text-destructive p-4 border border-destructive rounded-md">{error}</div>;
  }

  if (!svg) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return <div className="p-4 bg-card rounded-lg flex justify-center items-center" dangerouslySetInnerHTML={{ __html: svg }} />;
}
