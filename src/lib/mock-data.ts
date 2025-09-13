
import type { TechStack, Goal, ExperienceLevel } from './types';
import { Code, GitBranch, Puzzle, Lightbulb, Rocket, GraduationCap, BrainCircuit } from 'lucide-react';

export const techStacks: TechStack[] = [
  { id: 'react', name: 'React', icon: Code },
  { id: 'python', name: 'Python', icon: Code },
  { id: 'rust', name: 'Rust', icon: Code },
  { id: 'nodejs', name: 'Node.js', icon: GitBranch },
  { id: 'ml', name: 'ML', icon: BrainCircuit },
  { id: 'go', name: 'Go', icon: Code },
  { id: 'nextjs', name: 'Next.js', icon: Rocket },
  { id: 'vue', name: 'Vue', icon: Code },
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
