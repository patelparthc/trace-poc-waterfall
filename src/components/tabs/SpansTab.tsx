import { useState } from 'react';
import Badge from '../ui/Badge';
import Table from '../ui/Table';
import type { DashboardData, Span, TableColumn } from '../../types';

interface SpansTabProps {
    readonly data: DashboardData;
    readonly totalSpans: number;
    readonly selectedSpan?: Span | null;
    readonly onSpanSelect: (span: Span) => void;
    readonly onSpanDeselect: () => void;
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

export default function SpansTab({
    data,
    totalSpans,
    selectedSpan,
    onSpanSelect,
    onSpanDeselect
}: SpansTabProps) {
    const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed'>('all');
    const [filterAgent, setFilterAgent] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Get unique agent types for filter
    const agentTypes = [...new Set(data.spans.map(span => span.agentType).filter(Boolean))] as string[];

    const filteredSpans = data.spans.filter(span => {
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'success' && span.success) ||
            (filterStatus === 'failed' && !span.success);

        const matchesAgent = filterAgent === 'all' || span.agentType === filterAgent;

        const matchesSearch = searchTerm === '' ||
            span.operationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (span.agentType && span.agentType.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesStatus && matchesAgent && matchesSearch;
    });
    const spanColumns: TableColumn<Span>[] = [
        { key: 'operationName', header: 'Operation', sortable: true },
        { key: 'agentType', header: 'Agent Type', sortable: true },
        {
            key: 'startTime',
            header: 'Start Time',
            sortable: true,
            render: (span: Span) => new Date(span.startTime).toLocaleTimeString()
        },
        {
            key: 'duration',
            header: 'Duration',
            sortable: true,
            render: (span: Span) => formatDuration(span.duration)
        },
        {
            key: 'success',
            header: 'Status',
            render: (span: Span) => (
                <Badge variant={span.success ? 'success' : 'error'}>
                    {span.success ? 'Success' : 'Error'}
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
                    Spans ({filteredSpans.length} of {totalSpans})
                </h2>
            </div>

            {/* Filters and Search */}
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
                    placeholder="Search spans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        border: '1px solid var(--border-secondary)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        minWidth: '200px',
                        outline: 'none',
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)'
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
                                border: filterStatus === status ? '1px solid var(--accent-primary)' : '1px solid var(--border-secondary)',
                                backgroundColor: filterStatus === status ? 'var(--accent-primary)' : 'var(--bg-primary)',
                                color: filterStatus === status ? 'white' : 'var(--text-primary)',
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

                {/* Agent type filter */}
                <select
                    value={filterAgent}
                    onChange={(e) => setFilterAgent(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        border: '1px solid var(--border-secondary)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                    }}
                >
                    <option value="all">All Agents</option>
                    {agentTypes.map(agent => (
                        <option key={agent} value={agent}>
                            {agent}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table Container */}
            <div style={{
                flex: 1,
                overflow: 'hidden',
                minHeight: 0
            }}>
                <Table
                    data={filteredSpans}
                    columns={spanColumns}
                    onRowClick={onSpanSelect}
                />
            </div>

            {selectedSpan && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '400px',
                    height: '100%',
                    backgroundColor: 'var(--bg-primary)',
                    boxShadow: '-4px 0 16px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    padding: '24px',
                    overflowY: 'auto',
                    borderLeft: '1px solid var(--border-primary)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
                            Span Details
                        </h3>
                        <button
                            onClick={onSpanDeselect}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                Operation Name
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                {selectedSpan.operationName}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                Status
                            </div>
                            <div style={{ marginTop: '4px' }}>
                                <Badge variant={selectedSpan.success ? 'success' : 'error'}>
                                    {selectedSpan.success ? 'Success' : 'Error'}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                Duration
                            </div>
                            <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                {formatDuration(selectedSpan.duration)}
                            </div>
                        </div>

                        {selectedSpan.agentType && (
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                    Agent Type
                                </div>
                                <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                    {selectedSpan.agentType}
                                </div>
                            </div>
                        )}

                        {selectedSpan.model && (
                            <div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                    LLM Model
                                </div>
                                <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                    {selectedSpan.model}
                                </div>
                            </div>
                        )}

                        {selectedSpan.inputTokens && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                        Input Tokens
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                        {formatNumber(selectedSpan.inputTokens)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                        Output Tokens
                                    </div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                        {formatNumber(selectedSpan.outputTokens || 0)}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                Attributes
                            </div>
                            <div style={{
                                marginTop: '8px',
                                padding: '12px',
                                backgroundColor: 'var(--bg-secondary)',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                border: '1px solid var(--border-primary)'
                            }}>
                                {Object.entries(selectedSpan.attributes || {})
                                    .map(([key, value]) => (
                                        <div key={key} style={{ marginBottom: '4px' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>{key}:</span>{' '}
                                            <span style={{ color: 'var(--text-primary)' }}>{String(value)}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}