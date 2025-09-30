import { NextResponse } from 'next/server';
import { ArchitectureAnalyzer } from '@/lib/architecture-analyzer';

export async function GET() {
  try {
    console.log('Testing GitHub repository analysis...');
    
    // Test with a simple, well-known repository
    const testRepo = 'facebook/react';
    const [owner, repo] = testRepo.split('/');
    
    console.log(`Analyzing repository: ${owner}/${repo}`);
    
    const analyzer = new ArchitectureAnalyzer();
    const analysis = await analyzer.analyzeRepository(owner, repo, 2); // Use shallow depth for testing
    
    console.log(`Analysis completed successfully:`);
    console.log(`- Nodes: ${analysis.nodes.length}`);
    console.log(`- Edges: ${analysis.edges.length}`);
    console.log(`- Layers: ${Object.keys(analysis.layers).length}`);
    console.log(`- Total files: ${analysis.metrics.totalFiles}`);
    console.log(`- Total lines: ${analysis.metrics.totalLines}`);
    
    return NextResponse.json({
      success: true,
      message: 'GitHub repository analysis test completed successfully',
      data: {
        nodes: analysis.nodes.length,
        edges: analysis.edges.length,
        layers: Object.keys(analysis.layers).length,
        totalFiles: analysis.metrics.totalFiles,
        totalLines: analysis.metrics.totalLines,
        sampleNodes: analysis.nodes.slice(0, 3).map(node => ({
          id: node.id,
          name: node.name,
          type: node.type,
          filePath: node.filePath
        }))
      }
    });
  } catch (error) {
    console.error('GitHub repository analysis test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'GitHub repository analysis test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
