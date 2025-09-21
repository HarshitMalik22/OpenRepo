'use client';

import Image from 'next/image';
import type { Repository } from '@/lib/types';

interface RepositoryImageProps {
  repo: Repository;
  className?: string;
}

export default function RepositoryImage({ repo, className = "rounded-lg object-cover aspect-[5/3]" }: RepositoryImageProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const ownerLogin = typeof repo.owner === 'string' ? repo.owner : repo.owner?.login;
    const ownerAvatar = typeof repo.owner === 'object' ? repo.owner?.avatar_url : null;
    target.src = ownerAvatar || `https://ui-avatars.com/api/?name=${ownerLogin || repo.name}&background=0d1117&color=ffffff&size=500x300`;
  };

  return (
    <Image
      src={`https://opengraph.githubassets.com/1/${repo.full_name}`}
      alt={repo.name}
      width={500}
      height={300}
      className={className}
      onError={handleImageError}
    />
  );
}
