'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Repository } from '@/lib/types';

interface RepositoryImageProps {
  repo: Repository;
  className?: string;
}

export default function RepositoryImage({ repo, className = "rounded-lg object-cover aspect-[5/3]" }: RepositoryImageProps) {
  const [imageSrc, setImageSrc] = useState(() => {
    // Start with our API endpoint which handles caching and fallbacks
    return `/api/github-image?repo=${encodeURIComponent(repo.full_name)}`;
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    
    // If API fails, fall back to owner avatar
    if (!hasError) {
      setHasError(true);
      const ownerLogin = typeof repo.owner === 'string' ? repo.owner : repo.owner?.login;
      const ownerAvatar = typeof repo.owner === 'object' ? repo.owner?.avatar_url : null;
      target.src = ownerAvatar || `https://ui-avatars.com/api/?name=${ownerLogin || repo.name}&background=0d1117&color=ffffff&size=500x300`;
      return;
    }
    
    // Final fallback - generated avatar
    const ownerLogin = typeof repo.owner === 'string' ? repo.owner : repo.owner?.login;
    target.src = `https://ui-avatars.com/api/?name=${ownerLogin || repo.name}&background=0d1117&color=ffffff&size=500x300`;
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading image...</div>
        </div>
      )}
      <Image
        src={imageSrc}
        alt={repo.name}
        width={500}
        height={300}
        className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        unoptimized={true} // Skip optimization to avoid additional processing
      />
    </div>
  );
}
