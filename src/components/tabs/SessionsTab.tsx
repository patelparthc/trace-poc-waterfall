import { useState } from 'react';
import Badge from '../ui/Badge';
import Table from '../ui/Table';
import type { DashboardData, Session, TableColumn } from '../../types';

interface SessionsTabProps {
    readonly data: DashboardData;
    readonly totalSessions: number;
    readonly onNavigateToWaterfall?: (sessionId: string) => void;
    readonly isAuroraEnabled?: boolean;
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

export default function SessionsTab({ data, totalSessions, onNavigateToWaterfall, isAuroraEnabled = false }: SessionsTabProps) {
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
        {
            key: 'sessionId',
            header: 'Session',
            sortable: true,
            render: (session: Session) => (
                <div style={{ fontSize: '12px', lineHeight: '1.2' }}>
                    <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {session.sessionId.substring(0, 8)}...
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {session.userId} • {session.sessionType}
                    </div>
                </div>
            )
        },
        {
            key: 'startTime',
            header: 'Started',
            sortable: true,
            render: (session: Session) => (
                <div style={{ fontSize: '12px', lineHeight: '1.2' }}>
                    <div style={{ color: 'var(--text-primary)' }}>
                        {new Date(session.startTime).toLocaleDateString()}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            )
        },
        {
            key: 'duration',
            header: 'Duration',
            sortable: true,
            render: (session: Session) => (
                <span style={{ fontSize: '12px', fontWeight: '500' }}>
                    {formatDuration(session.duration)}
                </span>
            )
        },
        {
            key: 'stats',
            header: 'Stats',
            render: (session: Session) => (
                <div style={{ fontSize: '11px', lineHeight: '1.2', color: 'var(--text-secondary)' }}>
                    <div>{session.numTasks} tasks • {session.numAgents} agents</div>
                    <div style={{ marginTop: '2px' }}>{formatNumber(session.totalTokens)} tokens</div>
                </div>
            )
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
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0
            }}>
                <h2 style={{
                    margin: 0,
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                }}>
                    Sessions ({filteredSessions.length} of {totalSessions})
                </h2>
            </div>

            {/* Controls */}
            <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                flexWrap: 'wrap',
                flexShrink: 0
            }}>
                {/* Search input */}
                <input
                    type="text"
                    placeholder="Search sessions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        border: isAuroraEnabled ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-secondary)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        minWidth: '200px',
                        outline: 'none',
                        backgroundColor: isAuroraEnabled ? 'rgba(0, 0, 0, 0.4)' : 'var(--bg-primary)',
                        color: isAuroraEnabled ? '#ffffff' : 'var(--text-primary)',
                        backdropFilter: isAuroraEnabled ? 'blur(12px)' : 'none'
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
                                border: filterStatus === status ?
                                    (isAuroraEnabled ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid var(--accent-primary)') :
                                    (isAuroraEnabled ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-secondary)'),
                                backgroundColor: filterStatus === status ?
                                    (isAuroraEnabled ? 'rgba(255, 255, 255, 0.2)' : 'var(--accent-primary)') :
                                    (isAuroraEnabled ? 'rgba(0, 0, 0, 0.4)' : 'var(--bg-primary)'),
                                color: isAuroraEnabled ? '#ffffff' : (filterStatus === status ? 'white' : 'var(--text-primary)'),
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                backdropFilter: isAuroraEnabled ? 'blur(12px)' : 'none'
                            }}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div style={{ marginLeft: 'auto', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Success Rate: {((filteredSessions.filter(s => s.success).length / filteredSessions.length) * 100).toFixed(1)}%
                </div>
            </div>

            {/* Table Container */}
            <div style={{
                flex: 1,
                overflow: 'hidden',
                minHeight: 0
            }}>
                <Table
                    data={filteredSessions}
                    columns={sessionColumns}
                    isAuroraEnabled={isAuroraEnabled}
                    onRowClick={(session) => {
                        console.log('Selected session:', session);
                        if (onNavigateToWaterfall) {
                            onNavigateToWaterfall(session.sessionId);
                        }
                    }}
                />
            </div>
        </div>
    );
}