'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';

interface GitHubConfigStatus {
  isConfigured: boolean;
  hasToken: boolean;
  tokenPrefix?: string;
  rateLimitInfo?: {
    limit: number;
    remaining: number;
    reset: string;
  };
  warnings: string[];
}

export default function GitHubStatusIndicator() {
  const [configStatus, setConfigStatus] = useState<GitHubConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkGitHubConfig();
  }, []);

  const checkGitHubConfig = async () => {
    try {
      const response = await fetch('/api/github/config-status');
      const data = await response.json();
      
      if (data.success) {
        setConfigStatus(data.config);
      }
    } catch (error) {
      console.error('Failed to check GitHub config:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (!configStatus || configStatus.hasToken) {
    return null;
  }

  return (
    <Alert className="mb-6 border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800">GitHub Token Not Configured</AlertTitle>
      <AlertDescription className="text-orange-700">
        <div className="space-y-2">
          <p>
            You may experience rate limits and get fewer repositories (1-2 instead of 20+) without a GitHub token.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://github.com/settings/tokens', '_blank')}
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Get GitHub Token
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/GITHUB_TOKEN_SETUP.md', '_blank')}
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              Setup Instructions
            </Button>
          </div>
          {configStatus.warnings.length > 0 && (
            <div className="mt-3 text-sm">
              <strong>Warnings:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {configStatus.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
