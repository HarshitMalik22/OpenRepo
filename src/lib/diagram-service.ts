export interface DiagramGenerationRequest {
  username: string;
  repo: string;
  instructions?: string;
  github_pat?: string;
}

export interface DiagramGenerationResponse {
  diagram: string;
  explanation: string;
  repository: {
    name: string;
    full_name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    default_branch: string;
  };
}

export interface DiagramGenerationError {
  error: string;
}

export async function generateDiagram(
  request: DiagramGenerationRequest
): Promise<DiagramGenerationResponse | DiagramGenerationError> {
  try {
    const response = await fetch('/api/diagram/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || 'Failed to generate diagram' };
    }

    return await response.json() as DiagramGenerationResponse;
  } catch (error) {
    console.error('Error generating diagram:', error);
    return { error: 'Failed to generate diagram. Please try again later.' };
  }
}

export interface DiagramModificationRequest {
  username: string;
  repo: string;
  currentDiagram: string;
  instructions: string;
}

export async function modifyDiagram(
  request: DiagramModificationRequest
): Promise<DiagramGenerationResponse | DiagramGenerationError> {
  try {
    const response = await fetch('/api/diagram/modify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || 'Failed to modify diagram' };
    }

    return await response.json() as DiagramGenerationResponse;
  } catch (error) {
    console.error('Error modifying diagram:', error);
    return { error: 'Failed to modify diagram. Please try again later.' };
  }
}
