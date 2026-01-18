# OpenRepo 

## AI-Powered Open Source Code Understanding Platform

OpenRepo is a modern web application that helps developers understand and explore open-source repositories through an intuitive interface. Built with Next.js and TypeScript, it provides a clean, responsive UI for discovering and analyzing GitHub repositories with AI-powered insights.

## Key Features

### 🔍 Repository Discovery & Analysis
- **GitHub Integration**: Search and explore any public GitHub repository
- **Repository Metrics**: View stars, forks, issues, and other key metrics at a glance
- **AI-Powered Insights**: Get intelligent analysis of repository structure and components
- **Tech Stack Detection**: Automatically identifies and displays the technologies used

### 🎨 Modern UI/UX
- **Responsive Design**: Fully responsive layout that works on all devices
- **Dark/Light Mode**: Built-in theme support for comfortable viewing
- **Interactive Components**: Engaging UI elements with smooth animations
- **Bento Grid Layout**: Beautifully organized information architecture

### 🛠️ Developer Experience
- **Type-Safe Codebase**: Built with TypeScript for better developer experience
- **Component Library**: Reusable UI components with Radix UI primitives
- **Performance Optimized**: Fast page loads and smooth interactions
- **Modern Tooling**: Uses the latest Next.js 14 features and React 18

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **shadcn/ui** - Beautifully designed components
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Clean and consistent icons

### Backend & Data
- **Next.js API Routes** - Serverless API endpoints
- **GitHub REST API** - Repository data and metadata
- **Prisma** - Type-safe database client
- **PostgreSQL** - Primary database

### AI & Analysis
- **Google Gemini** - AI-powered code analysis
- **Genkit** - AI development framework
- **Mermaid.js** - Diagram and flowchart generation

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**
- **Google AI API Key** (for Gemini integration)
- **GitHub Personal Access Token** (for enhanced API access)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/HarshitMalik22/OpenRepo.git
   cd Openrepo
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   cp .env.example .env.local
   ```

   Add your API keys:

   ```env
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
   GITHUB_TOKEN=your_github_personal_access_token_here
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:9002
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002) to see the application.

### Available Scripts

- `npm run dev` - Start development server on port 9002
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit in watch mode

## 📁 Project Structure

```text
Openrepo/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── repos/             # Repository-related pages
│   │   ├── onboarding/        # User onboarding flow
│   │   ├── contact/           # Contact page
│   │   ├── contribute/        # Contribution guidelines
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   │   ├── ui/                # Base UI components (Radix UI)
│   │   ├── layout/            # Layout components
│   │   ├── interactive-flowchart-renderer.tsx
│   │   ├── enhanced-component-explorer.tsx
│   │   ├── repo-explanation-client.tsx
│   │   └── enhanced-repo-card.tsx
│   ├── ai/                    # AI-powered flows and functions
│   │   ├── flows/             # Genkit flows
│   │   ├── dev.ts             # AI development utilities
│   │   └── genkit.ts          # Genkit configuration
│   ├── lib/                   # Utility libraries and configurations
│   │   ├── github.ts          # GitHub API integration
│   │   ├── types.ts           # TypeScript type definitions
│   │   ├── mock-data.ts       # Development mock data
│   │   └── user-preferences.ts # User preference management
│   └── hooks/                 # Custom React hooks
├── docs/                      # Documentation
├── public/                    # Static assets
├── components.json            # Shadcn/ui configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies and scripts
```

## 🎯 How to Use Openrepo

### 1. **Onboarding**

When you first visit Openrepo, you'll be guided through an onboarding process where you:

- **Select Your Tech Stack**: Choose the programming languages and frameworks you're interested in
- **Set Experience Level**: Indicate whether you're a beginner, intermediate, or advanced developer
- **Define Learning Goals**: Specify what you want to achieve (e.g., "Learn React", "Understand System Design")

### 2. **Discover Repositories**

Use the repository discovery features to find projects:

- **Search**: Search for repositories by name, description, or keywords
- **Filter**: Filter by language, stars, forks, and update frequency
- **Browse**: Explore trending repositories in your chosen tech stack

### 3. **Analyze Repositories**

Once you find an interesting repository:

- **Click "Analyze"**: This triggers the AI-powered analysis
- **Wait for Processing**: The system will analyze the codebase and generate visualizations
- **View Results**: Explore the interactive flowchart and component explanations

### 4. **Explore the Analysis**

The analysis provides several ways to understand the repository:

#### **Interactive Flowchart**

- **Zoom & Pan**: Navigate through the architecture diagram
- **Click Nodes**: Click on components to see detailed information
- **Color Coding**: Different colors represent different types of components
- **Export**: Save the flowchart as an image

#### **Component Explorer**

- **Code Snippets**: View syntax-highlighted code with explanations
- **Metadata**: See file paths, line numbers, and complexity metrics
- **Dependencies**: Understand how components relate to each other
- **Search & Filter**: Find specific components quickly

### 5. **Learn & Contribute**

Use the insights to:

- **Understand Architecture**: Grasp the overall structure of the project
- **Identify Entry Points**: Find good places to start contributing
- **Learn Best Practices**: See how experienced developers structure code
- **Plan Contributions**: Use the analysis to plan your first contributions

## 🎨 Design System

### Color Palette

- **Background**: Dark Navy Blue (#1A202C) - Developer-friendly, focused environment
- **Primary**: Electric Purple (#A78BFA) - Engaging visual accents
- **Accent**: Soft Violet (#C084FC) - Complementary depth and visual interest
- **Text**: Light gray variants for optimal readability

### Typography

- **Headlines**: 'Space Grotesk' - Futuristic, modern impression
- **Body**: 'Inter' - Excellent readability for long-form content
- **Code**: 'Source Code Pro' - Optimized for code display

### UI Principles

- **Dark-first theme** - Reduces eye strain during long coding sessions
- **Card-based layout** - Clear content separation and organization
- **Mobile-first responsive design** - Works seamlessly on all devices
- **Accessible components** - Built with Radix UI for accessibility

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENAI_API_KEY` | Google AI API key for Gemini integration | Yes |
| `GITHUB_TOKEN` | GitHub Personal Access Token for enhanced API access | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js authentication | Yes |
| `NEXTAUTH_URL` | URL for NextAuth.js callbacks | Yes |

### Customization

#### **Tech Stack Configuration**

Edit `src/lib/mock-data.ts` to add or modify supported technologies:

```typescript
export const techStacks = [
  {
    name: "React",
    icon: "react",
    color: "#61DAFB",
    description: "A JavaScript library for building user interfaces"
  },
  // Add more technologies...
];
```

#### **AI Prompts**

Customize AI analysis prompts in `src/ai/flows/render-interactive-flowchart.ts` to adjust the depth and focus of repository analysis.

## 🤝 Contributing

We welcome contributions! Please see our [Contribution Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Run tests and linting** (`npm run lint && npm run typecheck`)
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Code Style

- Follow TypeScript best practices
- Use ESLint configuration provided
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 🐛 Troubleshooting

### Common Issues

#### **Build Errors**

```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### **TypeScript Errors**

```bash
# Check types
npm run typecheck
```

#### **API Key Issues**

- Ensure your Google AI API key is valid and has the correct permissions
- Verify your GitHub token has the necessary scopes
- Check that environment variables are properly set in `.env.local`

#### **Development Server Issues**

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📈 Performance & Optimization

### Code Splitting

- Next.js automatically splits code by route
- Large components are dynamically loaded
- AI analysis runs on the server to minimize client-side processing

### Caching

- Repository data is cached to reduce API calls
- Analysis results are stored for faster subsequent loads
- Static assets are optimized and served via CDN

### Bundle Size

- Tree-shaking removes unused code
- Dynamic imports for heavy components
- Optimized images and assets

## 🔒 Security

### API Key Management

- All API keys are stored in environment variables
- No sensitive data is exposed to the client
- GitHub tokens are used server-side only

### Data Privacy

- No user code is stored permanently
- Analysis results are ephemeral
- No personal data is collected without consent

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Add environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main branch

```bash
# Build for production
npm run build

# Export static files (if needed)
npm run export
```

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Google Cloud Platform
- DigitalOcean App Platform

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - For powering the intelligent code analysis
- **GitHub** - For providing the repository data and API
- **Vercel** - For the excellent Next.js framework and hosting platform
- **Radix UI** - For the accessible component library
- **Tailwind CSS** - For the utility-first CSS framework
- **Open Source Community** - For inspiring this project and providing the repositories to analyze

## 📞 Support

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Email**: Contact the maintainers for private inquiries

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Multi-repository Analysis**: Compare and analyze multiple repositories simultaneously
- [ ] **Learning Paths**: Guided learning journeys based on user goals
- [ ] **Collaborative Features**: Share analyses and collaborate with team members
- [ ] **Advanced Metrics**: Code quality, security, and performance analysis
- [ ] **Integration Support**: Connect with GitLab, Bitbucket, and other platforms
- [ ] **Mobile App**: Native mobile applications for iOS and Android
- [ ] **Offline Mode**: Download analyses for offline viewing
- [ ] **API Access**: RESTful API for programmatic access to analysis features

### Version History

#### **v1.0.0** (Current)

- ✅ AI-powered repository analysis
- ✅ Interactive flowchart visualization
- ✅ Enhanced component explorer
- ✅ Personalized recommendations
- ✅ Responsive design
- ✅ GitHub integration

---

Made with ❤️ by the Openrepo team

[⭐ Star us on GitHub](https://github.com/HarshitMalik22/OpenRepo) | [🐛 Report Issues](https://github.com/HarshitMalik22/OpenRepo/issues) | [💬 Join Discussions](https://github.com/HarshitMalik22/OpenRepo/discussions)
