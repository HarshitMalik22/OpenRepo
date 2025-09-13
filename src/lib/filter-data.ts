// Real filter data for repository filtering
export const competitionLevels = [
  { id: 'low', name: 'Low Competition', description: 'Few contributors, easy to stand out' },
  { id: 'medium', name: 'Medium Competition', description: 'Balanced contributor base' },
  { id: 'high', name: 'High Competition', description: 'Many contributors, challenging' }
] as const;

export const activityLevels = [
  { id: 'low', name: 'Low Activity', description: 'Slow development pace' },
  { id: 'medium', name: 'Medium Activity', description: 'Regular updates and contributions' },
  { id: 'high', name: 'High Activity', description: 'Very active development' }
] as const;

export const aiDomains = [
  { id: 'machine-learning', name: 'Machine Learning', description: 'ML, AI, and data science projects' },
  { id: 'nlp', name: 'Natural Language Processing', description: 'Text processing and language models' },
  { id: 'computer-vision', name: 'Computer Vision', description: 'Image and video processing' },
  { id: 'generative-ai', name: 'Generative AI', description: 'Content generation and creative AI' },
  { id: 'ai-infrastructure', name: 'AI Infrastructure', description: 'Tools and frameworks for AI development' },
  { id: 'ai-ethics', name: 'AI Ethics & Safety', description: 'Responsible AI development' },
  { id: 'ai-applications', name: 'AI Applications', description: 'Practical AI tools and applications' },
  { id: 'ai-research', name: 'AI Research', description: 'Cutting-edge AI research projects' },
  { id: 'other', name: 'Other AI', description: 'Other AI-related projects' }
] as const;

// Popular languages based on GitHub trends
export const popularLanguages = [
  'JavaScript',
  'Python',
  'TypeScript',
  'Java',
  'C++',
  'Go',
  'Rust',
  'Ruby',
  'PHP',
  'C#',
  'Swift',
  'Kotlin',
  'Scala',
  'Dart',
  'R',
  'Julia',
  'Lua',
  'Elixir',
  'Clojure',
  'Haskell'
];

// Tech stacks based on popular open source projects
export const techStacks = [
  { id: 'react', name: 'React', icon: '⚛️' },
  { id: 'vue', name: 'Vue.js', icon: '💚' },
  { id: 'angular', name: 'Angular', icon: '🅰️' },
  { id: 'nodejs', name: 'Node.js', icon: '🟢' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'django', name: 'Django', icon: '🎸' },
  { id: 'flask', name: 'Flask', icon: '🌶️' },
  { id: 'fastapi', name: 'FastAPI', icon: '⚡' },
  { id: 'tensorflow', name: 'TensorFlow', icon: '🧠' },
  { id: 'pytorch', name: 'PyTorch', icon: '🔥' },
  { id: 'rust', name: 'Rust', icon: '🦀' },
  { id: 'go', name: 'Go', icon: '🐹' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷' },
  { id: 'nextjs', name: 'Next.js', icon: '▲' },
  { id: 'svelte', name: 'Svelte', icon: '🔥' },
  { id: 'tailwind', name: 'Tailwind CSS', icon: '🎨' },
  { id: 'docker', name: 'Docker', icon: '🐳' },
  { id: 'kubernetes', name: 'Kubernetes', icon: '☸️' },
  { id: 'graphql', name: 'GraphQL', icon: '📊' }
];

// Goals for onboarding
export const goals = [
  { id: 'learn', name: 'Learn new technologies', description: 'Focus on educational projects' },
  { id: 'build-portfolio', name: 'Build portfolio', description: 'Projects that showcase your skills' },
  { id: 'network', name: 'Network with developers', description: 'Join active communities' },
  { id: 'contribute', name: 'Make meaningful contributions', description: 'Projects where you can have impact' },
  { id: 'start-project', name: 'Start own project', description: 'Learn from successful open source' }
];

// Experience levels for onboarding
export const experienceLevels = [
  { id: 'beginner', name: 'Beginner', description: 'New to open source' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some open source experience' },
  { id: 'advanced', name: 'Advanced', description: 'Experienced contributor' },
  { id: 'expert', name: 'Expert', description: 'Seasoned open source developer' }
];
