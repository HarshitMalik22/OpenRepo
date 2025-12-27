'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    Loader2,
    AlertCircle,
    BookOpen,
    Zap,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { IssueRecommendationCard } from '@/components/issue-recommendation-card';

// =============================================================================
// Types
// =============================================================================

interface RecommendedIssue {
    issue: {
        id: number;
        number: number;
        title: string;
        body: string | null;
        html_url: string;
        created_at: string;
        updated_at: string;
        labels: Array<{ name: string; color: string }>;
        assignee: { login: string } | null;
        comments: number;
    };
    matchScore: number;
    matchReasons: string[];
    requiredSkills: string[];
    estimatedEffort: 'quick' | 'medium' | 'substantial';
    repository: {
        full_name: string;
        html_url: string;
        language: string | null;
        stargazers_count: number;
    };
}

// =============================================================================
// Constants
// =============================================================================

const LANGUAGES = [
    { value: 'all', label: 'All Languages' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'java', label: 'Java' },
    { value: 'ruby', label: 'Ruby' },
];

const TECH_STACKS = [
    'React', 'Next.js', 'Vue', 'Angular', 'Node.js',
    'Python', 'Django', 'Flask', 'Go', 'Rust',
    'TypeScript', 'GraphQL', 'Docker', 'Kubernetes'
];

const EXPERIENCE_LEVELS = [
    { value: 'beginner', label: '🌱 Beginner' },
    { value: 'intermediate', label: '🌿 Intermediate' },
    { value: 'advanced', label: '🌳 Advanced' },
];

// =============================================================================
// Page Component
// =============================================================================

export default function IssuesPage() {
    const [issues, setIssues] = useState<RecommendedIssue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [language, setLanguage] = useState('all');
    const [experience, setExperience] = useState('intermediate');
    const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

    // Fetch issues
    const fetchIssues = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (language && language !== 'all') params.append('languages', language);
            if (experience) params.append('experience', experience);
            if (selectedTechs.length > 0) params.append('techStack', selectedTechs.join(','));
            params.append('limit', '30');

            const response = await fetch(`/api/repositories/recommended-issues?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setIssues(data.recommendations);
            } else {
                setError(data.error || 'Failed to fetch issues');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Network error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, [language, experience, selectedTechs]);

    const toggleTech = (tech: string) => {
        setSelectedTechs(prev =>
            prev.includes(tech)
                ? prev.filter(t => t !== tech)
                : [...prev, tech]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                                <BookOpen className="h-6 w-6 text-emerald-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white">Find Your First Issue</h1>
                        </div>
                        <p className="text-lg text-slate-400">
                            AI-powered issue recommendations matched to your skills and experience level.
                            Start contributing to open source today.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Filters */}
            <div className="border-b border-slate-800 bg-slate-900/30">
                <div className="container mx-auto px-4 py-6">
                    <div className="space-y-4">
                        {/* Primary Filters */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-slate-400" />
                                <span className="text-sm text-slate-400">Filters:</span>
                            </div>

                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-[160px] bg-slate-800 border-slate-700">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map(lang => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={experience} onValueChange={setExperience}>
                                <SelectTrigger className="w-[180px] bg-slate-800 border-slate-700">
                                    <SelectValue placeholder="Experience" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EXPERIENCE_LEVELS.map(level => (
                                        <SelectItem key={level.value} value={level.value}>
                                            {level.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchIssues}
                                disabled={loading}
                                className="border-slate-700"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>

                        {/* Tech Stack Tags */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-slate-500 mr-2">Your skills:</span>
                            {TECH_STACKS.map(tech => (
                                <Badge
                                    key={tech}
                                    variant={selectedTechs.includes(tech) ? 'default' : 'outline'}
                                    className={`cursor-pointer transition-all ${selectedTechs.includes(tech)
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                                        }`}
                                    onClick={() => toggleTech(tech)}
                                >
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="container mx-auto px-4 py-8">
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 text-emerald-400 animate-spin mb-4" />
                        <p className="text-slate-400">Finding issues matched to your skills...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">Failed to load issues</h2>
                        <p className="text-slate-400 mb-4">{error}</p>
                        <Button onClick={fetchIssues} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Results Grid */}
                {!loading && !error && (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-slate-400">
                                Found <span className="text-white font-semibold">{issues.length}</span> issues
                                {selectedTechs.length > 0 && (
                                    <span> matching your {selectedTechs.length} selected skill{selectedTechs.length > 1 ? 's' : ''}</span>
                                )}
                            </p>

                            {issues.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Zap className="h-4 w-4 text-emerald-400" />
                                    Sorted by match score
                                </div>
                            )}
                        </div>

                        {issues.length === 0 ? (
                            <div className="text-center py-20">
                                <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-white mb-2">No issues found</h2>
                                <p className="text-slate-400 mb-4">Try adjusting your filters or adding more skills</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {issues.map((issue, index) => (
                                    <motion.div
                                        key={issue.issue.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <IssueRecommendationCard issue={issue} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
