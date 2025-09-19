import Badge from '../ui/Badge';
import MetricCard from '../ui/MetricCard';
import type { DashboardData, Span } from '../../types';

interface OverviewTabProps {
    readonly data: DashboardData;
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

export default function OverviewTab({ data, metrics }: OverviewTabProps) {
    return (
        <div style={{ padding: '32px' }}>
            {/* Metrics Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
            }}>
                <MetricCard
                    title="Total Spans"
                    value={formatNumber(metrics.totalSpans)}
                    description={`${metrics.successfulSpans} successful, ${metrics.errorSpans} errors`}
                    color="#10b981"
                />
                <MetricCard
                    title="Success Rate"
                    value={`${metrics.successRate}%`}
                    description={`${metrics.successfulSpans}/${metrics.totalSpans} spans successful`}
                    color={parseFloat(metrics.successRate) > 90 ? "#10b981" : "#f59e0b"}
                />
                <MetricCard
                    title="Sessions"
                    value={formatNumber(metrics.totalSessions)}
                    description={`${metrics.sessionSuccessRate}% success rate`}
                    color="#3b82f6"
                />
                <MetricCard
                    title="Avg Duration"
                    value={formatDuration(metrics.avgDuration)}
                    description="Average span duration"
                    color="#8b5cf6"
                />
                <MetricCard
                    title="LLM Calls"
                    value={formatNumber(metrics.llmSpansCount)}
                    description={`${formatNumber(metrics.totalInputTokens)} input, ${formatNumber(metrics.totalOutputTokens)} output tokens`}
                    color="#f59e0b"
                />
                <MetricCard
                    title="Agent Tasks"
                    value={formatNumber(metrics.agentSpansCount)}
                    description={`${Object.keys(metrics.agentTypeMap).length} agent types active`}
                    color="#ec4899"
                />
            </div>

            {/* Recent Activity */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb'
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1f2937'
                    }}>
                        Recent Activity
                    </h3>
                </div>
                <div style={{ padding: '24px' }}>
                    <div style={{
                        display: 'grid',
                        gap: '16px'
                    }}>
                        {(() => {
                            const sortedSpans = [...data.spans].sort((a: Span, b: Span) =>
                                new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
                            );
                            return sortedSpans.slice(0, 5).map((span: Span) => (
                                <div key={span.spanId} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: '#1f2937',
                                            marginBottom: '4px'
                                        }}>
                                            {span.operationName}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#6b7280'
                                        }}>
                                            {span.agentType && `${span.agentType} • `}
                                            {formatDuration(span.duration)}
                                        </div>
                                    </div>
                                    <div style={{ marginLeft: '16px' }}>
                                        <Badge variant={span.success ? 'success' : 'error'}>
                                            {span.success ? 'Success' : 'Error'}
                                        </Badge>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
}