import type { Repository, TechStack, Goal, ExperienceLevel } from './types';
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

export const mockRepositories: Repository[] = [
  {
    id: '1',
    slug: 'shadcn-ui',
    name: 'shadcn/ui',
    description: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
    stars: 58300,
    language: 'TypeScript',
    githubUrl: 'https://github.com/shadcn/ui',
    tags: ['React', 'Next.js', 'TypeScript', 'Design System'],
    explanation: {
      why: 'shadcn/ui revolutionizes component libraries by providing unstyled, copy-pasteable components, giving developers full control over styling and behavior.',
      what: 'It is not a traditional component library. Instead, it provides a CLI to add individual components built with Radix UI and Tailwind CSS directly into your project.',
      how: 'The core logic is in its CLI, which fetches component source code and adds it to your project. This avoids dependency bloat and allows for maximum customization.',
      flowchartMermaid: `
graph TD;
    A[Developer runs 'npx shadcn-ui add button'] --> B{CLI};
    B --> C[Fetches 'button' component source];
    C --> D[Adds 'button.tsx' to project's components/ui folder];
    D --> E[Developer imports and uses Button component];
    subgraph "Your Project"
        E
    end
    subgraph "shadcn/ui Registry"
        C
    end
`,
      explanation: {
        'CLI': "The command-line interface that scaffolds components into your project.",
        'Component Source': "The source code for each component, stored in a registry.",
        'Developer Usage': "Once added, the component is part of your codebase, ready to be used and customized."
      },
    },
    resources: [
      { type: 'docs', title: 'Official Documentation', url: 'https://ui.shadcn.com/docs' },
      { type: 'video', title: 'The BEST Component Library for React?', url: 'https://www.youtube.com/watch?v=LDCi_1argpc' },
      { type: 'blog', title: 'Why I Moved from Material UI to shadcn/ui', url: '#' },
    ],
    modules: [
        { name: 'CLI', description: 'Handles adding components to the user\'s project.' },
        { name: 'Component Registry', description: 'The source of truth for all component code.' },
        { name: 'Radix Primitives', description: 'The underlying headless UI components used for accessibility.' }
    ]
  },
  {
    id: '2',
    slug: 'nextjs-fire-chat',
    name: 'Next.js Fire-Chat',
    description: 'A full-stack real-time chat application built with Next.js, Firebase, and Tailwind CSS.',
    stars: 1200,
    language: 'TypeScript',
    githubUrl: 'https://github.com/firebase/codelab-friendlychat-web',
    tags: ['React', 'Next.js', 'Firebase', 'Real-time'],
    explanation: {
        why: 'This project is a great example of combining Next.js server components with Firebase for real-time data synchronization.',
        what: 'It is a chat application where users can sign in with Google/GitHub and chat in different rooms. Messages are updated in real-time for all users.',
        how: 'Firebase Firestore is used as the database. The app subscribes to Firestore collections, and Next.js re-renders components when data changes.',
        flowchartMermaid: `
graph TD;
    subgraph Client-Side
        A[User Signs In] --> B(Firebase Auth);
        C[User Sends Message] --> D{POST to API Route};
    end
    subgraph Server-Side (Next.js)
        B --> E[Auth State Checked];
        D --> F[API Route '/api/messages'];
    end
    subgraph Firebase
        F --> G[Write to Firestore 'messages' collection];
        G -- Real-time update --> H[Other Clients];
    end
`,
        explanation: {
            'Firebase Auth': 'Handles user authentication via Google and GitHub OAuth providers.',
            'API Route': 'A Next.js API route that receives new messages and saves them to Firestore.',
            'Firestore': 'The NoSQL database that stores all chat messages and user data.'
        },
    },
    resources: [
        { type: 'docs', title: 'Next.js App Router', url: 'https://nextjs.org/docs/app' },
        { type: 'video', title: 'Next.js 14 Full Course', url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk' },
        { type: 'docs', title: 'Firebase Firestore Web SDK', url: 'https://firebase.google.com/docs/firestore/quickstart' },
    ],
    modules: [
        { name: 'app/layout.tsx', description: 'Root layout with Firebase context providers.' },
        { name: 'app/(auth)/login/page.tsx', description: 'Login page with FirebaseUI or custom auth handlers.' },
        { name: 'app/chat/[roomId]/page.tsx', description: 'The main chat interface, which fetches and displays messages.' },
        { name: 'app/api/messages/route.ts', description: 'API endpoint for creating new messages.' }
    ]
  },
];
