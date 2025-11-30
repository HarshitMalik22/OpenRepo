
import type { TechStack, Goal, ExperienceLevel, CommunityStats, Testimonial } from './types';
import { Code, GitBranch, Puzzle, Lightbulb, Rocket, GraduationCap } from 'lucide-react';

export const techStacks: TechStack[] = [
  { id: 'react', name: 'React', logo: '/logos/react.svg' },
  { id: 'python', name: 'Python', logo: '/logos/python.svg' },
  { id: 'rust', name: 'Rust', logo: '/logos/rust.svg' },
  { id: 'nodejs', name: 'Node.js', logo: '/logos/nodejs.svg' },
  { id: 'ml', name: 'ML', logo: '/logos/ml.svg' },
  { id: 'go', name: 'Go', logo: '/logos/go.svg' },
  { id: 'nextjs', name: 'Next.js', logo: '/logos/nextjs.svg' },
  { id: 'vue', name: 'Vue', logo: '/logos/vue.svg' },
];

export const goals: Goal[] = [
  { id: 'learn', name: 'Learn a new technology', icon: GraduationCap },
  { id: 'contribute', name: 'Contribute to a project', icon: Puzzle },
  { id: 'architecture', name: 'Understand architecture', icon: GitBranch },
  { id: 'inspiration', name: 'Find inspiration', icon: Lightbulb },
];

export const experienceLevels: ExperienceLevel[] = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
];

// Competition level options
export const competitionLevels = [
  { id: 'very-high', name: 'Very High', description: '50k+ stars, highly competitive' },
  { id: 'high', name: 'High', description: '10k+ stars, competitive' },
  { id: 'moderate', name: 'Moderate', description: '1k+ stars, balanced' },
  { id: 'low', name: 'Low', description: '100+ stars, accessible' },
  { id: 'very-low', name: 'Very Low', description: '<100 stars, easy to contribute' },
];

// Activity level options
export const activityLevels = [
  { id: 'highest', name: 'Highest', description: 'Updated within 7 days, very active' },
  { id: 'high', name: 'High', description: 'Updated within 30 days, active' },
  { id: 'moderate', name: 'Moderate', description: 'Updated within 90 days, somewhat active' },
  { id: 'low', name: 'Low', description: 'Updated over 90 days ago, less active' },
];

// AI domain options
export const aiDomains = [
  { id: 'oss-google-docs', name: 'OSS Google Docs', description: 'Collaborative documentation tools' },
  { id: 'lucid', name: 'Lucid', description: 'Diagram and visualization tools' },
  { id: 'dive-into-ai', name: 'Dive into AI', description: 'AI and machine learning projects' },
  { id: 'supermemory-ai', name: 'SuperMemory AI', description: 'Memory and knowledge management' },
  { id: 'cap', name: 'Cap', description: 'Caps and headwear related projects' },
  { id: 'mail0', name: 'Mail0', description: 'Email and communication tools' },
  { id: 'other', name: 'Other', description: 'Other AI-powered projects' },
];

// Community statistics
export const communityStats: CommunityStats = {
  totalQueries: 19427,
  totalUsers: 6589,
  activeRepositories: 1247,
  successfulContributions: 3421,
  averageSatisfaction: 4.7,
};

// Testimonials
export const testimonials: Testimonial[] = [
  {
    id: '1',
    userName: 'Sarah Chen',
    userHandle: '@sarahcdev',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    content: 'OpenRepo helped me find the perfect React project to contribute to. The AI-powered recommendations were spot on!',
    rating: 5,
    date: '2024-01-15',
    repository: 'facebook/react',
  },
  {
    id: '2',
    userName: 'Mike Rodriguez',
    userHandle: '@mikecodes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    content: 'The interactive flowcharts made understanding complex architectures so much easier. I can now navigate large codebases with confidence.',
    rating: 5,
    date: '2024-01-10',
    repository: 'vercel/next.js',
  },
  {
    id: '3',
    userName: 'Emily Watson',
    userHandle: '@emilywatson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    content: 'As a beginner, I was overwhelmed by open source. OpenRepo guided me to beginner-friendly projects and helped me make my first contribution!',
    rating: 4,
    date: '2024-01-08',
    repository: 'python/cpython',
  },
  {
    id: '4',
    userName: 'David Kim',
    userHandle: '@davidkimdev',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    content: 'The personalized recommendations saved me hours of searching. I found exactly what I was looking for based on my tech stack preferences.',
    rating: 5,
    date: '2024-01-05',
    repository: 'rust-lang/rust',
  },
  {
    id: '5',
    userName: 'Lisa Thompson',
    userHandle: '@lisathompson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    content: 'The contribution difficulty assessment helped me choose projects that matched my skill level. No more jumping into projects that are too complex!',
    rating: 4,
    date: '2024-01-03',
    repository: 'tensorflow/tensorflow',
  },
];

// Popular languages for filtering
export const popularLanguages = [
  'JavaScript', 'Python', 'TypeScript', 'Java', 'Go', 'Rust', 'C++', 'PHP', 'Ruby', 'Swift'
];
