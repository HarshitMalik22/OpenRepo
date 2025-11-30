"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
// import mermaid from 'mermaid'; // Removed to fix SSR error
// import svgPanZoom from 'svg-pan-zoom'; // Removed to fix SSR error
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedMermaidChartProps {
  chart: string;
  className?: string;
  zoomingEnabled?: boolean;
  onNodeClick?: (nodeId: string) => void;
}

// Mermaid initialization moved to component

type PanZoomInstance = any;

export function EnhancedMermaidChart({
  chart,
  className,
  zoomingEnabled = true,
  onNodeClick
}: EnhancedMermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panZoomRef = useRef<PanZoomInstance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initMermaid = async () => {
      try {
        const mermaidModule = await import('mermaid');
        const mermaid = mermaidModule.default || mermaidModule;

        mermaid.initialize({
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'var(--font-sans, Arial, sans-serif)',
          themeVariables: {
            primaryColor: '#7e57c2',
            primaryTextColor: '#2d3748',
            primaryBorderColor: '#9f7aea',
            lineColor: '#a0aec0',
            secondaryColor: '#4299e1',
            tertiaryColor: '#f6ad55',
            quaternaryColor: '#68d391',
            background: '#ffffff',
            nodeTextColor: '#2d3748',
            nodeBorder: '2px',
            nodeBorderRadius: '8px',
            nodeFontSize: '14px',
            edgeLabelBackground: '#f7fafc',
            edgeLabelColor: '#4a5568',
          },
          themeCSS: `
            .node rect, .node circle, .node polygon {
              stroke: #7e57c2 !important;
              fill: #f0f9ff !important;
              stroke-width: 2px;
              rx: 8px;
              ry: 8px;
              filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05));
            }
            
            .node.clickable {
              cursor: pointer;
            }
            
            .node.clickable:hover rect, 
            .node.clickable:hover circle, 
            .node.clickable:hover polygon {
              stroke: #9f7aea !important;
              fill: #e9d8fd !important;
              filter: drop-shadow(0 4px 8px rgba(159, 122, 234, 0.3));
            }
            
            .edgeLabel {
              background-color: #f7fafc !important;
              color: #4a5568 !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 4px;
              padding: 2px 6px;
              font-size: 12px;
            }
            
            .label {
              color: #2d3748 !important;
              font-weight: 500;
            }
            
            .cluster rect {
              fill: #f0fdf4 !important;
              stroke: #86efac !important;
              stroke-width: 2px !important;
              rx: 12px !important;
              ry: 12px !important;
            }
            
            .cluster-label {
              color: #15803d !important;
              font-weight: 600 !important;
              border: none !important;
            }
            
            /* Color variations for different node types */
            .node.database rect, .node.database circle, .node.database polygon {
              fill: #dbeafe !important;
              stroke: #3b82f6 !important;
            }
            
            .node.api rect, .node.api circle, .node.api polygon {
              fill: #fef3c7 !important;
              stroke: #f59e0b !important;
            }
            
            .node.ui rect, .node.ui circle, .node.ui polygon {
              fill: #dcfce7 !important;
              stroke: #10b981 !important;
            }
            
            .node.service rect, .node.service circle, .node.service polygon {
              fill: #f3e8ff !important;
              stroke: #8b5cf6 !important;
            }
            
            /* Arrow styling */
            .marker {
              fill: #a0aec0 !important;
              stroke: #a0aec0 !important;
            }
            
            .edgePath path {
              stroke: #a0aec0 !important;
              stroke-width: 2px !important;
            }`
        });
      } catch (err) {
        console.error('Failed to initialize mermaid:', err);
      }
    };

    initMermaid();
  }, []);

  const destroyPanZoom = useCallback(() => {
    if (panZoomRef.current) {
      try {
        panZoomRef.current.destroy();
      } catch (error) {
        console.warn('Failed to destroy panzoom instance:', error);
      } finally {
        panZoomRef.current = null;
      }
    }
  }, []);

  const normalizeSvgDimensions = useCallback((svgElement: SVGSVGElement) => {
    if (!svgElement) return;

    try {
      // Remove viewBox to allow natural rendering
      svgElement.removeAttribute('viewBox');

      // Set preserveAspectRatio to allow scaling
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      // Remove all size constraints to let diagram extend beyond container
      svgElement.style.width = 'auto';
      svgElement.style.height = 'auto';
      svgElement.style.maxWidth = 'none';
      svgElement.style.maxHeight = 'none';
      svgElement.style.minWidth = 'auto';
      svgElement.style.minHeight = 'auto';

      // Force the SVG to render at its natural size
      svgElement.style.overflow = 'visible';
    } catch (error) {
      console.error('Error normalizing SVG dimensions:', error);
    }
  }, []);

  const fitDiagramToViewport = useCallback((instance: PanZoomInstance, attempt = 0) => {
    try {
      const sizes = instance.getSizes();
      if (!sizes) {
        if (attempt < 3) {
          setTimeout(() => fitDiagramToViewport(instance, attempt + 1), 200);
        }
        return;
      }

      // Without viewBox, just reset to allow natural diagram size
      instance.resetZoom();
      // Don't center - let diagram use its natural position
    } catch (error) {
      console.error('Error fitting diagram:', error);
    }
  }, []);

  const initializePanZoom = useCallback(async (svgElement: SVGSVGElement) => {
    destroyPanZoom();

    try {
      // Ensure SVG has valid dimensions before initializing
      const bbox = svgElement.getBBox();
      if (bbox.width === 0 || bbox.height === 0) {
        console.warn('SVG has zero dimensions, skipping pan-zoom initialization');
        return;
      }

      // Dynamically import svg-pan-zoom to avoid SSR issues
      const svgPanZoomModule = await import('svg-pan-zoom');
      const svgPanZoom = svgPanZoomModule.default || svgPanZoomModule;

      const instance = svgPanZoom(svgElement, {
        zoomEnabled: zoomingEnabled,
        panEnabled: true,
        mouseWheelZoomEnabled: true,
        dblClickZoomEnabled: true,
        preventMouseEventsDefault: true,
        minZoom: 0.01,
        maxZoom: 10,
        fit: false,
        center: false,
        zoomScaleSensitivity: 0.1,
      });

      // Only fit diagram if zooming is enabled
      if (zoomingEnabled) {
        fitDiagramToViewport(instance);
      }

      if (!zoomingEnabled) {
        instance.disableZoom();
        instance.disablePan();
      }

      panZoomRef.current = instance;
    } catch (error) {
      console.error('Error initializing pan-zoom:', error);
    }
  }, [destroyPanZoom, fitDiagramToViewport, zoomingEnabled]);

  const handleZoomIn = () => {
    panZoomRef.current?.zoomBy(1.2);
  };

  const handleZoomOut = () => {
    panZoomRef.current?.zoomBy(0.8);
  };

  const handleResetView = () => {
    if (panZoomRef.current) {
      fitDiagramToViewport(panZoomRef.current);
    }
  };

  // Handle chart rendering
  useEffect(() => {
    if (!chart) {
      setIsLoading(false);
      setError('No chart data provided');
      return;
    }

    let isMounted = true;

    const renderChart = async () => {
      try {
        if (!isMounted) return;

        setIsLoading(true);
        setError(null);

        if (containerRef.current) {
          destroyPanZoom();
          containerRef.current.innerHTML = '';

          const chartShell = document.createElement('div');
          chartShell.className = 'mermaid';
          chartShell.textContent = chart;

          // Ensure the chartShell is properly attached to DOM before rendering
          containerRef.current.appendChild(chartShell);

          try {
            const mermaidModule = await import('mermaid');
            const mermaid = mermaidModule.default || mermaidModule;
            const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);

            // Check if component is still mounted and element is still in DOM
            if (!isMounted || !chartShell.isConnected) {
              console.log('Component unmounted during rendering, skipping update');
              return;
            }

            chartShell.innerHTML = svg;
          } catch (renderError) {
            if (!isMounted) return;
            console.error('Mermaid render error:', renderError);
            throw new Error(`Failed to render mermaid chart: ${renderError instanceof Error ? renderError.message : 'Unknown error'}`);
          }

          if (!isMounted) return;

          const svgElement = chartShell.querySelector('svg');

          if (onNodeClick && svgElement) {
            const nodes = svgElement.querySelectorAll<SVGElement>('.node');
            nodes.forEach(node => {
              node.classList.add('clickable');
              node.style.cursor = 'pointer';
              node.addEventListener('click', () => {
                const nodeId = node.id.replace(/^flowchart-\d+-/, '');
                onNodeClick(nodeId);
              });
            });
          }

          if (svgElement && isMounted) {
            normalizeSvgDimensions(svgElement);
            // Add small delay to ensure SVG is fully rendered before initializing pan-zoom
            setTimeout(() => {
              if (isMounted) {
                initializePanZoom(svgElement);
              }
            }, 100);
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error rendering Mermaid chart:', err);
        setError('Failed to render the architecture diagram. The diagram syntax might be invalid.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
      destroyPanZoom();
    };
  }, [chart, destroyPanZoom, initializePanZoom, normalizeSvgDimensions, onNodeClick]);

  useEffect(() => {
    if (!panZoomRef.current) return;

    if (zoomingEnabled) {
      panZoomRef.current.enableZoom();
      panZoomRef.current.enablePan();
    } else {
      panZoomRef.current.disableZoom();
      panZoomRef.current.disablePan();
      panZoomRef.current.resetZoom();
    }
  }, [zoomingEnabled]);

  return (
    <div className={cn('relative w-full min-h-[500px] overflow-x-visible overflow-y-visible', className)}>
      <div
        ref={containerRef}
        className="h-full w-full overflow-visible rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/70 dark:to-slate-900/40"
      />

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-slate-950/40">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-500 dark:border-slate-700 dark:border-t-slate-200" />
        </div>
      )}

      {error && (
        <div className="absolute inset-4 flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/90 p-4 text-center text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-100">
          <p className="text-sm font-semibold">Unable to render diagram</p>
          <p className="text-xs opacity-80">{error}</p>
        </div>
      )}

      {zoomingEnabled && !isLoading && !error && (
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleZoomIn}
            className="rounded-md bg-white/90 p-2 text-slate-700 shadow-sm ring-1 ring-black/5 transition hover:bg-white dark:bg-slate-900/80 dark:text-slate-100"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="rounded-md bg-white/90 p-2 text-slate-700 shadow-sm ring-1 ring-black/5 transition hover:bg-white dark:bg-slate-900/80 dark:text-slate-100"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="rounded-md bg-white/90 p-2 text-slate-700 shadow-sm ring-1 ring-black/5 transition hover:bg-white dark:bg-slate-900/80 dark:text-slate-100"
            aria-label="Reset view"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default EnhancedMermaidChart;
