import MetricCard from '../ui/MetricCard';
import type { TabType } from '../../types';

interface OverviewTabProps {
    readonly onNavigateToTab?: (tab: TabType) => void;
    readonly metrics: {
        totalSpans: number;
        successfulSpans: number;
        errorSpans: number;
        successRate: string;
        totalSessions: number;
        sessionSuccessRate: string;
        avgDuration: number;
        totalInputTokens: number;
        totalOutputTokens: number;
        llmSpansCount: number;
        agentSpansCount: number;
        agentTypeMap: Record<string, number>;
    };
}

const formatDuration = (duration: number): string => {
    if (duration < 1000) return `${duration.toFixed(0)}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}m`;
};

const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

export default function OverviewTab({ metrics, onNavigateToTab }: OverviewTabProps) {
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            overflow: 'auto'
        }}>
            {/* Metrics Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                flexShrink: 0
            }}>
                <MetricCard
                    title="Total Spans"
                    value={formatNumber(metrics.totalSpans)}
                    description={`${metrics.successfulSpans} successful, ${metrics.errorSpans} errors`}
                    color="var(--success)"
                    icon="🔗"
                    onClick={() => onNavigateToTab?.('spans')}
                />
                <MetricCard
                    title="Success Rate"
                    value={`${metrics.successRate}%`}
                    description={`${metrics.successfulSpans}/${metrics.totalSpans} spans successful`}
                    color={parseFloat(metrics.successRate) > 90 ? "var(--success)" : "var(--warning)"}
                    icon="✅"
                    onClick={() => onNavigateToTab?.('spans')}
                />
                <MetricCard
                    title="Sessions"
                    value={formatNumber(metrics.totalSessions)}
                    description={`${metrics.sessionSuccessRate}% success rate`}
                    color="var(--accent-primary)"
                    icon="👥"
                    onClick={() => onNavigateToTab?.('sessions')}
                />
                <MetricCard
                    title="Avg Duration"
                    value={formatDuration(metrics.avgDuration)}
                    description="Average span duration"
                    color="var(--accent-secondary)"
                    icon="⏱️"
                    onClick={() => onNavigateToTab?.('traces')}
                />
                <MetricCard
                    title="LLM Calls"
                    value={formatNumber(metrics.llmSpansCount)}
                    description={`${formatNumber(metrics.totalInputTokens)} input, ${formatNumber(metrics.totalOutputTokens)} output tokens`}
                    color="var(--warning)"
                    icon="🤖"
                    onClick={() => onNavigateToTab?.('spans')}
                />
                <MetricCard
                    title="Agent Tasks"
                    value={formatNumber(metrics.agentSpansCount)}
                    description={`${Object.keys(metrics.agentTypeMap).length} agent types active`}
                    color="var(--error)"
                    icon="⚡"
                    onClick={() => onNavigateToTab?.('spans')}
                />
            </div>
        </div>
    );
}