
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
  {
    id: '3',
    slug: 'tensorflow',
    name: 'TensorFlow',
    description: 'An end-to-end open source platform for machine learning. It has a comprehensive, flexible ecosystem of tools, libraries, and community resources.',
    stars: 180000,
    language: 'C++',
    githubUrl: 'https://github.com/tensorflow/tensorflow',
    tags: ['ML', 'Python', 'C++', 'AI'],
    explanation: {
      why: 'TensorFlow is a foundational library for large-scale machine learning, created and maintained by Google.',
      what: 'It allows developers to build and train machine learning models for a variety of tasks, from image recognition to natural language processing.',
      how: 'It works by creating and manipulating tensors (multi-dimensional arrays) in a computational graph. High-level APIs like Keras make it easy to use.',
      flowchartMermaid: `graph TD; A[Input Data] --> B(Model); B --> C[Output/Prediction];`,
      explanation: {'Model': 'The core of the machine learning system.'},
    },
    resources: [
      { type: 'docs', title: 'TensorFlow Core Docs', url: 'https://www.tensorflow.org/guide' },
    ],
    modules: [
        { name: 'tensorflow/python', description: 'The Python API for TensorFlow.' },
        { name: 'tensorflow/core', description: 'The C++ core runtime and kernels.' },
        { name: 'tensorflow/lite', description: 'For deploying models on mobile and embedded devices.' }
    ]
  },
  {
    id: '4',
    slug: 'vscode',
    name: 'Visual Studio Code',
    description: 'A lightweight but powerful source code editor which runs on your desktop and is available for Windows, macOS and Linux.',
    stars: 155000,
    language: 'TypeScript',
    githubUrl: 'https://github.com/microsoft/vscode',
    tags: ['Editor', 'TypeScript', 'Electron'],
    explanation: {
      why: 'VS Code is one of the most popular code editors in the world, known for its performance and extensive extension ecosystem.',
      what: 'It is a code editor, not a full IDE, but it has rich features like debugging, Git integration, and an integrated terminal.',
      how: 'Built with Electron, it uses web technologies (HTML, CSS, TypeScript) to create a cross-platform desktop application.',
      flowchartMermaid: `graph TD; A[Main Process] --> B(Renderer Process); B --> C(Editor UI);`,
      explanation: {'Main Process': 'Manages windows and services.'},
    },
    resources: [
      { type: 'docs', title: 'VS Code Docs', url: 'https://code.visualstudio.com/docs' },
    ],
    modules: [
        { name: 'src/vs/workbench', description: 'The main workbench UI and services.' },
        { name: 'src/vs/editor', description: 'The core text editor component.' },
        { name: 'extensions', description: 'The API and built-in extensions.' }
    ]
  },
    {
    id: '5',
    slug: 'react',
    name: 'React',
    description: 'A JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called “components”.',
    stars: 218000,
    language: 'JavaScript',
    githubUrl: 'https://github.com/facebook/react',
    tags: ['React', 'JavaScript', 'UI', 'Frontend'],
    explanation: {
      why: 'React is the most popular frontend library for building modern, fast, and scalable web applications.',
      what: 'It uses a declarative approach to UI development, where you describe what the UI should look like, and React takes care of updating the DOM efficiently.',
      how: 'It uses a virtual DOM to keep track of changes and only updates the actual DOM when necessary, which is a key to its performance.',
      flowchartMermaid: `graph TD; A[Component State Changes] --> B{Virtual DOM Diff}; B --> C[Update Real DOM];`,
      explanation: {'Virtual DOM': 'An in-memory representation of the UI.'},
    },
    resources: [
      { type: 'docs', title: 'React Documentation', url: 'https://react.dev/' },
    ],
    modules: [
        { name: 'packages/react', description: 'The core React library.' },
        { name: 'packages/react-dom', description: 'Provides DOM-specific methods.' },
        { name: 'packages/react-reconciler', description: 'The algorithm React uses to diff two trees.' }
    ]
  },
  {
    id: '6',
    slug: 'kubernetes',
    name: 'Kubernetes',
    description: 'An open-source system for automating deployment, scaling, and management of containerized applications.',
    stars: 104000,
    language: 'Go',
    githubUrl: 'https://github.com/kubernetes/kubernetes',
    tags: ['Go', 'DevOps', 'Containers', 'Orchestration'],
    explanation: {
      why: 'Kubernetes is the de-facto standard for container orchestration, helping to manage complex microservices architectures reliably.',
      what: 'It groups containers that make up an application into logical units for easy management and discovery.',
      how: 'It works with a master-node architecture. The master node schedules workloads, and the worker nodes run the containers.',
      flowchartMermaid: `graph TD; A[User defines desired state in YAML] --> B(API Server); B --> C{Scheduler}; C --> D[Nodes run Pods];`,
      explanation: {'API Server': 'The central management point of a Kubernetes cluster.'},
    },
    resources: [
      { type: 'docs', title: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs/home/' },
    ],
    modules: [
        { name: 'pkg/scheduler', description: 'Component that watches for newly created pods that have no node assigned.' },
        { name: 'pkg/kubelet', description: 'An agent that runs on each node in the cluster.' },
        { name: 'cmd/kube-apiserver', description: 'The main API server logic.' }
    ]
  },
    {
    id: '7',
    slug: 'moby',
    name: 'Docker (Moby Project)',
    description: 'An open platform for developers and sysadmins to build, ship, and run distributed applications.',
    stars: 67000,
    language: 'Go',
    githubUrl: 'https://github.com/moby/moby',
    tags: ['Go', 'DevOps', 'Containers'],
    explanation: {
      why: 'Docker popularized containerization, making it easy to package applications and their dependencies into a single, portable unit.',
      what: 'It is a tool designed to make it easier to create, deploy, and run applications by using containers.',
      how: 'It uses a client-server architecture. The Docker client talks to the Docker daemon, which does the heavy lifting of building, running, and distributing Docker containers.',
      flowchartMermaid: `graph TD; A[Dockerfile] --> B(Docker Build); B --> C[Docker Image]; C --> D(Docker Run); D --> E[Container];`,
      explanation: {'Dockerfile': 'A text document that contains all the commands a user could call on the command line to assemble an image.'},
    },
    resources: [
      { type: 'docs', title: 'Docker Documentation', url: 'https://docs.docker.com/' },
    ],
    modules: [
        { name: 'builder', description: 'Handles the `docker build` command logic.' },
        { name: 'daemon', description: 'The Docker engine daemon.' },
        { name: 'client', description: 'The Docker command-line client.' }
    ]
  }
];
