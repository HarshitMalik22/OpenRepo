"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface EnhancedMermaidChartProps {
  chart: string;
  zoomingEnabled?: boolean;
}

const EnhancedMermaidChart = ({ chart, zoomingEnabled = true }: EnhancedMermaidChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Sanitize and prepare chart content
  const sanitizedChart = chart?.trim() || '';
  const processedChart = sanitizedChart
    .replace(/^[\s\n]*/, '') // Remove leading whitespace
    .replace(/[\s\n]*$/, '') // Remove trailing whitespace
    .replace(/\n{3,}/g, '\n\n') // Reduce excessive newlines
    .replace(/\[\"([^\"]+)\"\]/g, '["$1"]') // Fix escaped quotes in node labels
    .replace(/\[\[\"([^\"]+)\\\"\]\]/g, '["$1"]') // Fix double-escaped quotes
    .replace(/click ([^\s]+) \"([^\"]+)\"/g, 'click $1 "$2"') // Ensure click syntax is correct
    .replace(/classDef ([^\s]+) fill:([^,]+)/g, 'classDef $1 fill:$2') // Fix classDef syntax
    .replace(/\n\s*%%\s*Styles[\s\S]*$/, '') // Remove trailing styles section that might be incomplete
    .replace(/\n\s*%%\s*Connections[\s\S]*?\n\s*%%\s*Styles/, '\n%% Connections\n%% Styles'); // Fix section ordering

  useEffect(() => {
    if (!processedChart) {
      setError('No chart content provided');
      return;
    }

    // Validate basic Mermaid syntax
    const validationError = validateMermaidSyntax(processedChart);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    
    try {
      mermaid.initialize({
        startOnLoad: true,
        theme: "neutral",
        htmlLabels: true,
        flowchart: {
          htmlLabels: true,
          curve: "basis",
          nodeSpacing: 50,
          rankSpacing: 50,
          padding: 15,
        },
        themeCSS: `
          .clickable {
            transition: transform 0.2s ease;
          }
          .clickable:hover {
            transform: scale(1.05);
            cursor: pointer;
          }
          .clickable:hover > * {
            filter: brightness(0.85);
          }
        `,
      });

      const initializePanZoom = async () => {
        const svgElement = containerRef.current?.querySelector("svg");
        if (svgElement && zoomingEnabled) {
          // Remove any max-width constraints
          svgElement.style.maxWidth = "none";
          svgElement.style.width = "100%";
          svgElement.style.height = "100%";

          if (zoomingEnabled) {
            try {
              // Dynamically import svg-pan-zoom only when needed in the browser
              const svgPanZoom = (await import("svg-pan-zoom")).default;
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              svgPanZoom(svgElement, {
                zoomEnabled: true,
                controlIconsEnabled: true,
                fit: true,
                center: true,
                minZoom: 0.1,
                maxZoom: 10,
                zoomScaleSensitivity: 0.3,
              });
            } catch (error) {
              console.error("Failed to load svg-pan-zoom:", error);
            }
          }
        }
      };

      mermaid.contentLoaded();
      // Wait for the SVG to be rendered
      setTimeout(() => {
        void initializePanZoom();
      }, 100);
    } catch (err) {
      console.error('Mermaid initialization error:', err);
      setError('Failed to initialize chart');
    }
  }, [processedChart, zoomingEnabled]);

  // Validate Mermaid syntax
  const validateMermaidSyntax = (chartContent: string): string | null => {
    const lines = chartContent.split('\n');
    
    // Check for basic structure
    if (!lines.some(line => line.trim().startsWith('graph') || line.trim().startsWith('flowchart'))) {
      return 'Chart must start with "graph" or "flowchart"';
    }
    
    // Check for common syntax errors
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and comments
      if (!line || line.startsWith('%%')) continue;
      
      // Check for unbalanced quotes
      const quoteCount = (line.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        return `Unbalanced quotes on line ${i + 1}: ${line}`;
      }
      
      // Check for malformed click statements
      const clickMatch = line.match(/^click\s+(\S+)\s+(\S+)$/);
      if (clickMatch && !clickMatch[2].startsWith('"')) {
        return `Malformed click statement on line ${i + 1}: ${line}`;
      }
      
      // Check for malformed classDef statements
      const classDefMatch = line.match(/^classDef\s+(\S+)\s+fill:([^,\s]+)/);
      if (classDefMatch && !classDefMatch[2].startsWith('#')) {
        return `Malformed classDef statement on line ${i + 1}: ${line}`;
      }
    }
    
    return null;
  };

  if (error) {
    return (
      <div className="w-full p-4 border border-red-300 rounded-lg bg-red-50">
        <div className="text-red-700 font-medium">Chart Error</div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
        <details className="mt-2">
          <summary className="text-red-600 text-sm cursor-pointer">Show chart content</summary>
          <pre className="mt-2 p-2 bg-red-100 rounded text-xs overflow-auto max-h-40">
            {processedChart}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-full p-4 ${zoomingEnabled ? "h-[600px]" : ""}`}
    >
      <div
        key={`${processedChart}-${zoomingEnabled}`}
        className={`mermaid h-full ${
          zoomingEnabled ? "rounded-lg border-2 border-black" : ""
        }`}
      >
        {processedChart}
      </div>
    </div>
  );
};

export default EnhancedMermaidChart;
