// Real filter data for repository filtering
export const competitionLevels = [
  { id: 'very-low', name: 'Very Low Competition', description: 'Very few contributors, easiest to stand out' },
  { id: 'low', name: 'Low Competition', description: 'Few contributors, easy to stand out' },
  { id: 'medium', name: 'Medium Competition', description: 'Balanced contributor base' },
  { id: 'high', name: 'High Competition', description: 'Many contributors, challenging' },
  { id: 'very-high', name: 'Very High Competition', description: 'Extremely popular, very challenging' }
] as const;

export const activityLevels = [
  { id: 'low', name: 'Low Activity', description: 'Slow development pace' },
  { id: 'medium', name: 'Medium Activity', description: 'Regular updates and contributions' },
  { id: 'high', name: 'High Activity', description: 'Very active development' },
  { id: 'highest', name: 'Highest Activity', description: 'Extremely active with frequent updates' }
] as const;

export const aiDomains = [
  { id: 'oss-google-docs', name: 'Documentation & Collaboration', description: 'Documentation tools and collaboration platforms' },
  { id: 'lucid', name: 'Diagrams & Visualization', description: 'Chart, diagram, and visualization tools' },
  { id: 'dive-into-ai', name: 'AI & Machine Learning', description: 'Artificial intelligence and machine learning projects' },
  { id: 'supermemory-ai', name: 'Knowledge & Memory', description: 'Knowledge management and memory systems' },
  { id: 'cap', name: 'Headwear & Accessories', description: 'Projects related to caps, hats, and accessories' },
  { id: 'mail0', name: 'Email & Communication', description: 'Email clients and communication tools' },
  { id: 'other', name: 'Other Projects', description: 'Projects that do not fit other categories' }
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
  { id: 'tailwind', name: 'Tailwind CSS', icon: '🌊' },
  { id: 'docker', name: 'Docker', icon: '🐳' },
  { id: 'kubernetes', name: 'Kubernetes', icon: '☸️' },
  { id: 'aws', name: 'AWS', icon: '☁️' },
  { id: 'blockchain', name: 'Blockchain', icon: '⛓️' }
];

export const goals = [
  { id: 'learn', name: 'Learn new technologies', description: 'Focus on educational projects', icon: '📚' },
  { id: 'build-portfolio', name: 'Build portfolio', description: 'Projects that showcase your skills', icon: '💼' },
  { id: 'network', name: 'Network with developers', description: 'Join active communities', icon: '🤝' },
  { id: 'contribute', name: 'Make meaningful contributions', description: 'Projects where you can have impact', icon: '🚀' },
  { id: 'start-project', name: 'Start own project', description: 'Learn from successful open source', icon: '💡' }
];

// Experience levels for onboarding
export const experienceLevels = [
  { id: 'beginner', name: 'Beginner', description: 'New to open source' },
  { id: 'intermediate', name: 'Intermediate', description: 'Some open source experience' },
  { id: 'advanced', name: 'Advanced', description: 'Experienced contributor' },
  { id: 'expert', name: 'Expert', description: 'Seasoned open source developer' }
];
