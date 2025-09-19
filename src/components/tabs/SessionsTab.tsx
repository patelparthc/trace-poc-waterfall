import { useState } from 'react';
import Badge from '../ui/Badge';
import Table from '../ui/Table';
import type { DashboardData, Session, TableColumn } from '../../types';

interface SessionsTabProps {
    readonly data: DashboardData;
    readonly totalSessions: number;
    readonly onNavigateToWaterfall?: (sessionId: string) => void;
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

export default function SessionsTab({ data, totalSessions, onNavigateToWaterfall }: SessionsTabProps) {
    const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSessions = data.sessions.filter(session => {
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'success' && session.success) ||
            (filterStatus === 'failed' && !session.success);

        const matchesSearch = searchTerm === '' ||
            session.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.sessionType.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const sessionColumns: TableColumn<Session>[] = [
        { key: 'sessionId', header: 'Session ID', sortable: true },
        { key: 'userId', header: 'User', sortable: true },
        { key: 'sessionType', header: 'Type', sortable: true },
        {
            key: 'startTime',
            header: 'Start Time',
            sortable: true,
            render: (session: Session) => new Date(session.startTime).toLocaleString()
        },
        {
            key: 'duration',
            header: 'Duration',
            sortable: true,
            render: (session: Session) => formatDuration(session.duration)
        },
        { key: 'numTasks', header: 'Tasks', sortable: true },
        { key: 'numAgents', header: 'Agents', sortable: true },
        {
            key: 'totalTokens',
            header: 'Tokens',
            sortable: true,
            render: (session: Session) => formatNumber(session.totalTokens)
        },
        {
            key: 'success',
            header: 'Status',
            render: (session: Session) => (
                <Badge variant={session.success ? 'success' : 'error'}>
                    {session.success ? 'Success' : 'Failed'}
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
                    Sessions ({filteredSessions.length} of {totalSessions})
                </h2>
            </div>

            {/* Filters and Search */}
            <div style={{
                marginBottom: '24px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        minWidth: '200px',
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        color: '#1f2937'
                    }}
                />

                {/* Status filters */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'success', 'failed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status as any)}
                            style={{
                                padding: '6px 12px',
                                border: filterStatus === status ? '1px solid #3b82f6' : '1px solid #d1d5db',
                                backgroundColor: filterStatus === status ? '#eff6ff' : 'white',
                                color: filterStatus === status ? '#3b82f6' : '#374151',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#6b7280' }}>
                    Success Rate: {((filteredSessions.filter(s => s.success).length / filteredSessions.length) * 100).toFixed(1)}%
                </div>
            </div>

            <Table
                data={filteredSessions}
                columns={sessionColumns}
                onRowClick={(session) => {
                    console.log('Selected session:', session);
                    if (onNavigateToWaterfall) {
                        onNavigateToWaterfall(session.sessionId);
                    }
                }}
            />
        </div>
    );
}