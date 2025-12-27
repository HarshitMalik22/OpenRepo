'use client';

import { motion } from 'framer-motion';
import {
    Shield,
    Zap,
    FileText,
    Users,
    HelpCircle,
    Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// =============================================================================
// Types
// =============================================================================

interface ReadinessMetrics {
    score: number;
    tier: 'excellent' | 'good' | 'moderate' | 'challenging' | 'difficult';
    responseTime: {
        avgHours: number;
        grade: 'A' | 'B' | 'C' | 'D' | 'F';
    };
    documentation: {
        hasContributing: boolean;
        grade: 'A' | 'B' | 'C' | 'D' | 'F';
    };
    communityHealth: {
        healthPercentage: number;
        grade: 'A' | 'B' | 'C' | 'D' | 'F';
    };
    firstTimer: {
        goodFirstIssueCount: number;
        isFriendly: boolean;
        grade: 'A' | 'B' | 'C' | 'D' | 'F';
    };
    breakdown: {
        responseTimeScore: number;
        documentationScore: number;
        communityHealthScore: number;
        firstTimerScore: number;
    };
}

interface ReadinessScoreBadgeProps {
    repositoryFullName: string;
    variant?: 'compact' | 'detailed' | 'minimal';
    className?: string;
    showTooltip?: boolean;
}

// =============================================================================
// Style Helpers
// =============================================================================

const tierColors: Record<ReadinessMetrics['tier'], {
    bg: string;
    text: string;
    border: string;
    glow: string;
}> = {
    excellent: {
        bg: 'bg-emerald-500/20',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
        glow: 'shadow-emerald-500/20'
    },
    good: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500/40',
        glow: 'shadow-green-500/20'
    },
    moderate: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/40',
        glow: 'shadow-yellow-500/20'
    },
    challenging: {
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500/40',
        glow: 'shadow-orange-500/20'
    },
    difficult: {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500/40',
        glow: 'shadow-red-500/20'
    }
};

const gradeColors: Record<string, string> = {
    A: 'text-emerald-400',
    B: 'text-green-400',
    C: 'text-yellow-400',
    D: 'text-orange-400',
    F: 'text-red-400'
};

function getTierLabel(tier: ReadinessMetrics['tier']): string {
    const labels = {
        excellent: 'Excellent',
        good: 'Good',
        moderate: 'Moderate',
        challenging: 'Challenging',
        difficult: 'Difficult'
    };
    return labels[tier];
}

function formatResponseTime(hours: number): string {
    if (hours < 1) return '< 1 hour';
    if (hours < 24) return `${Math.round(hours)} hours`;
    if (hours < 168) return `${Math.round(hours / 24)} days`;
    return `${Math.round(hours / 168)} weeks`;
}

// =============================================================================
// Component
// =============================================================================

export function ReadinessScoreBadge({
    repositoryFullName,
    variant = 'compact',
    className = '',
    showTooltip = true
}: ReadinessScoreBadgeProps) {
    const [metrics, setMetrics] = useState<ReadinessMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchReadiness() {
            try {
                setLoading(true);
                setError(null);

                const encodedName = encodeURIComponent(repositoryFullName);
                const response = await fetch(`/api/repositories/${encodedName}/readiness`);

                if (!response.ok) {
                    throw new Error('Failed to fetch readiness score');
                }

                const data = await response.json();

                if (!cancelled && data.success) {
                    setMetrics(data.metrics);
                } else if (!cancelled && !data.success) {
                    setError(data.error || 'Unknown error');
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Failed to load');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchReadiness();

        return () => {
            cancelled = true;
        };
    }, [repositoryFullName]);

    // Loading state
    if (loading) {
        return (
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-700/50 ${className}`}>
                <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                <span className="text-xs text-slate-400">Loading...</span>
            </div>
        );
    }

    // Error state
    if (error || !metrics) {
        return (
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-700/50 ${className}`}>
                <HelpCircle className="h-3 w-3 text-slate-500" />
                <span className="text-xs text-slate-500">N/A</span>
            </div>
        );
    }

    const colors = tierColors[metrics.tier];

    // Minimal variant - just the score
    if (variant === 'minimal') {
        const badge = (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`
          inline-flex items-center gap-1 px-1.5 py-0.5 rounded
          ${colors.bg} ${colors.text} ${colors.border} border
          ${className}
        `}
            >
                <Shield className="h-3 w-3" />
                <span className="text-xs font-semibold">{metrics.score}</span>
            </motion.div>
        );

        if (!showTooltip) return badge;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{badge}</TooltipTrigger>
                    <TooltipContent side="top" className="bg-slate-800 border-slate-700">
                        <p className="text-sm">
                            Contribution Readiness: <span className={colors.text}>{getTierLabel(metrics.tier)}</span>
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    // Compact variant - score + tier
    if (variant === 'compact') {
        const badge = (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`
          inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg
          ${colors.bg} ${colors.border} border
          shadow-lg ${colors.glow}
          ${className}
        `}
            >
                <Shield className={`h-4 w-4 ${colors.text}`} />
                <div className="flex items-baseline gap-1">
                    <span className={`text-sm font-bold ${colors.text}`}>{metrics.score}</span>
                    <span className="text-xs text-slate-400">/100</span>
                </div>
                <div className={`h-4 w-px bg-slate-600`} />
                <span className={`text-xs font-medium ${colors.text}`}>
                    {getTierLabel(metrics.tier)}
                </span>
            </motion.div>
        );

        if (!showTooltip) return badge;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>{badge}</TooltipTrigger>
                    <TooltipContent
                        side="top"
                        className="bg-slate-800 border-slate-700 p-3 max-w-xs"
                    >
                        <div className="space-y-2">
                            <p className="font-semibold text-sm">Contribution Readiness</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <div className="flex items-center gap-1">
                                    <Zap className="h-3 w-3 text-slate-400" />
                                    <span>Response:</span>
                                    <span className={gradeColors[metrics.responseTime.grade]}>
                                        {formatResponseTime(metrics.responseTime.avgHours)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FileText className="h-3 w-3 text-slate-400" />
                                    <span>Docs:</span>
                                    <span className={gradeColors[metrics.documentation.grade]}>
                                        Grade {metrics.documentation.grade}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3 text-slate-400" />
                                    <span>Community:</span>
                                    <span className={gradeColors[metrics.communityHealth.grade]}>
                                        {metrics.communityHealth.healthPercentage}%
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <HelpCircle className="h-3 w-3 text-slate-400" />
                                    <span>Beginner:</span>
                                    <span className={gradeColors[metrics.firstTimer.grade]}>
                                        {metrics.firstTimer.goodFirstIssueCount} issues
                                    </span>
                                </div>
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    // Detailed variant - full breakdown
    return (
        <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`
        rounded-xl p-4 space-y-4
        ${colors.bg} ${colors.border} border
        shadow-xl ${colors.glow}
        ${className}
      `}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield className={`h-5 w-5 ${colors.text}`} />
                    <span className="font-semibold text-white">Contribution Readiness</span>
                </div>
                <div className={`
          px-3 py-1 rounded-full text-sm font-bold
          ${colors.bg} ${colors.text} ${colors.border} border
        `}>
                    {metrics.score}/100
                </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metrics.score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${colors.text.replace('text-', 'bg-')}`}
                    />
                </div>
                <p className={`text-xs text-center ${colors.text}`}>
                    {getTierLabel(metrics.tier)} for Contributors
                </p>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-3">
                <MetricItem
                    icon={<Zap className="h-4 w-4" />}
                    label="Response Time"
                    value={formatResponseTime(metrics.responseTime.avgHours)}
                    grade={metrics.responseTime.grade}
                    score={metrics.breakdown.responseTimeScore}
                />
                <MetricItem
                    icon={<FileText className="h-4 w-4" />}
                    label="Documentation"
                    value={metrics.documentation.hasContributing ? 'Has CONTRIBUTING' : 'Basic'}
                    grade={metrics.documentation.grade}
                    score={metrics.breakdown.documentationScore}
                />
                <MetricItem
                    icon={<Users className="h-4 w-4" />}
                    label="Community Health"
                    value={`${metrics.communityHealth.healthPercentage}%`}
                    grade={metrics.communityHealth.grade}
                    score={metrics.breakdown.communityHealthScore}
                />
                <MetricItem
                    icon={<HelpCircle className="h-4 w-4" />}
                    label="Beginner Friendly"
                    value={`${metrics.firstTimer.goodFirstIssueCount} issues`}
                    grade={metrics.firstTimer.grade}
                    score={metrics.breakdown.firstTimerScore}
                />
            </div>
        </motion.div>
    );
}

// =============================================================================
// Sub-components
// =============================================================================

interface MetricItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    score: number;
}

function MetricItem({ icon, label, value, grade, score }: MetricItemProps) {
    return (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-800/50">
            <div className="text-slate-400 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{label}</span>
                    <span className={`text-xs font-bold ${gradeColors[grade]}`}>
                        {grade}
                    </span>
                </div>
                <div className="text-sm text-white truncate">{value}</div>
                <div className="h-1 bg-slate-700 rounded-full mt-1">
                    <div
                        className={`h-full rounded-full ${gradeColors[grade].replace('text-', 'bg-')}`}
                        style={{ width: `${(score / 25) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

export default ReadinessScoreBadge;
