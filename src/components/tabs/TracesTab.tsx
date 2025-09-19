import Badge from '../ui/Badge';
import Table from '../ui/Table';
import type { DashboardData, TableColumn } from '../../types';

interface TracesTabProps {
    readonly data: DashboardData;
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

export default function TracesTab({ data }: TracesTabProps) {
    // Group spans by session to create traces
    const traces = data.sessions.map(session => {
        const sessionSpans = data.spans.filter(span => span.traceId === session.traceId);
        return {
            ...session,
            spans: sessionSpans,
            spanCount: sessionSpans.length,
            errorCount: sessionSpans.filter(span => !span.success).length
        };
    });

    const traceColumns: TableColumn<typeof traces[0]>[] = [
        { key: 'sessionId', header: 'Trace ID', sortable: true },
        { key: 'userId', header: 'User', sortable: true },
        { key: 'sessionType', header: 'Type', sortable: true },
        {
            key: 'startTime',
            header: 'Start Time',
            sortable: true,
            render: (trace) => new Date(trace.startTime).toLocaleString()
        },
        {
            key: 'duration',
            header: 'Duration',
            sortable: true,
            render: (trace) => formatDuration(trace.duration)
        },
        {
            key: 'spanCount',
            header: 'Spans',
            sortable: true,
            render: (trace) => formatNumber(trace.spanCount)
        },
        {
            key: 'errorCount',
            header: 'Errors',
            sortable: true,
            render: (trace) => trace.errorCount > 0 ? (
                <span style={{ color: '#dc2626', fontWeight: '500' }}>
                    {trace.errorCount}
                </span>
            ) : (
                <span style={{ color: '#16a34a' }}>0</span>
            )
        },
        {
            key: 'success',
            header: 'Status',
            render: (trace) => (
                <Badge variant={trace.success ? 'success' : 'error'}>
                    {trace.success ? 'Success' : 'Failed'}
                </Badge>
            )
        }
    ];

    return (
        <div style={{ padding: '32px' }}>
            <div style={{
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#1f2937'
                }}>
                    Traces ({traces.length})
                </h2>
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '14px',
                    color: '#6b7280'
                }}>
                    <span>Total Spans: {formatNumber(data.spans.length)}</span>
                    <span>•</span>
                    <span>Avg Duration: {formatDuration(traces.reduce((acc, t) => acc + t.duration, 0) / traces.length)}</span>
                </div>
            </div>

            <Table
                data={traces}
                columns={traceColumns}
                onRowClick={(trace) => console.log('Selected trace:', trace)}
            />
        </div>
    );
}