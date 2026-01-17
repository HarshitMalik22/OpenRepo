'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ExternalLink,
    Clock,
    MessageSquare,
    Star,
    Zap,
    ArrowRight,
    User,
    Tag,
    BarChart2
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

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

interface IssueRecommendationCardProps {
    issue: RecommendedIssue;
    className?: string;
}

// =============================================================================
// Helpers
// =============================================================================

const getBadgeClass = () => {
    return 'bg-white/20 dark:bg-black/30 backdrop-blur-sm text-gray-700 dark:text-gray-200 border border-white/30 dark:border-white/20 hover:bg-white/30 dark:hover:bg-black/40 transition-colors';
};

const effortConfig = {
    quick: { label: 'Quick Fix', icon: Zap },
    medium: { label: 'Medium', icon: Clock },
    substantial: { label: 'Substantial', icon: BarChart2 },
};

const formatNumber = (num: number) => {
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
};

// =============================================================================
// Component
// =============================================================================

export function IssueRecommendationCard({
    issue,
    className = '',
}: IssueRecommendationCardProps) {
    const effort = effortConfig[issue.estimatedEffort];
    const EffortIcon = effort.icon;
    const [owner, repo] = issue.repository.full_name.split('/');

    // Humanize the match score
    let matchLabel = 'Recommended';
    let matchColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    let gradient = 'from-blue-500/50 to-cyan-500/50';

    if (issue.matchScore >= 90) {
        matchLabel = 'Top Pick';
        matchColor = 'text-purple-400 border-purple-500/30 bg-purple-500/10';
        gradient = 'from-purple-500/50 to-pink-500/50';
    } else if (issue.matchScore >= 80) {
        matchLabel = 'Great Match';
        matchColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
        gradient = 'from-emerald-500/50 to-teal-500/50';
    }

    return (
        <div
            className={`group relative flex flex-col h-full overflow-hidden rounded-xl bg-card dark:bg-zinc-900 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
        >
            {/* Top Accent Gradient */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient} opacity-70`} />

            <div className="p-5 flex flex-col flex-grow relative z-10">
                {/* Header: Repo & Match */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img
                            src={`https://github.com/${owner}.png`}
                            alt={owner}
                            className="w-10 h-10 rounded-lg shadow-inner bg-muted"
                        />
                        <div>
                            <a
                                href={issue.repository.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                            >
                                {owner} / {repo}
                            </a>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    {formatNumber(issue.repository.stargazers_count)}
                                </span>
                                {issue.repository.language && (
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                                        {issue.repository.language}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`text-xs px-3 py-1 font-medium rounded-full border ${matchColor} shadow-sm`}>
                        {matchLabel}
                    </div>
                </div>

                {/* Issue Title */}
                <h3 className="font-bold text-lg text-foreground leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    <a href={issue.issue.html_url} target="_blank" rel="noopener noreferrer">
                        {issue.issue.title}
                    </a>
                </h3>

                <div className="text-xs text-muted-foreground font-mono mb-4">
                    #{issue.issue.number} • opened {formatDistanceToNow(new Date(issue.issue.created_at))} ago
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {/* Effort Tag */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 text-xs font-medium text-secondary-foreground border border-border">
                        <EffortIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        {effort.label}
                    </div>

                    {/* Custom Labels */}
                    {issue.issue.labels.slice(0, 3).map((label) => (
                        <span
                            key={label.name}
                            className="px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider opacity-90"
                            style={{
                                backgroundColor: `#${label.color}15`,
                                color: `#${label.color}`,
                                border: `1px solid #${label.color}30`
                            }}
                        >
                            {label.name}
                        </span>
                    ))}
                </div>

                {/* Footer action */}
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex -space-x-2 overflow-hidden">
                        {/* Fake contributors for 'activity' feel if real ones aren't available, or just empty */}
                        {issue.issue.assignee ? (
                            <img
                                src={issue.issue.assignee.login ? `https://github.com/${issue.issue.assignee.login}.png` : ''}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-background"
                                title={`Assigned to ${issue.issue.assignee.login}`}
                            />
                        ) : (
                            <span className="text-xs text-emerald-600 dark:text-emerald-500 font-medium flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Open for contribution
                            </span>
                        )}
                    </div>

                    <a
                        href={issue.issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group/btn"
                    >
                        View Issue
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default IssueRecommendationCard;
