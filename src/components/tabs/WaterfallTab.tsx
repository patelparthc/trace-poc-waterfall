import { useState } from 'react';
import Badge from '../ui/Badge';
import type { DashboardData, Span } from '../../types';

interface WaterfallTabProps {
    readonly data: DashboardData;
    readonly selectedSessionId?: string | null;
}

const formatDuration = (duration: number): string => {
    if (duration < 1000) return `${duration.toFixed(0)}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}m`;
};

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString();
};

export default function WaterfallTab({ data, selectedSessionId }: WaterfallTabProps) {
    // Use selectedSessionId if provided, otherwise default to first session
    const initialTraceId = selectedSessionId
        ? data.sessions.find(s => s.sessionId === selectedSessionId)?.traceId || null
        : data.sessions.length > 0 ? data.sessions[0]?.traceId || null : null;

    const [selectedTraceId, setSelectedTraceId] = useState<string | null>(initialTraceId);
    const [selectedSpan, setSelectedSpan] = useState<Span | null>(null);

    // Get traces (sessions) for selection
    const traces = data.sessions.slice(0, 15); // Show traces for selection

    const selectedTrace = traces.find(trace => trace.traceId === selectedTraceId);
    const selectedSpans = selectedTrace ?
        data.spans.filter(span => span.traceId === selectedTrace.traceId).sort((a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        ) : [];

    // Calculate timeline bounds for selected trace
    const getTimelineBounds = (spans: Span[]) => {
        if (spans.length === 0) return { min: 0, max: 1000 };
        const times = spans.map(span => new Date(span.startTime).getTime());
        const durations = spans.map(span => span.duration);
        const min = Math.min(...times);
        const max = Math.max(...times.map((time, i) => time + (durations[i] || 0)));
        return { min, max };
    };

    const { min, max } = getTimelineBounds(selectedSpans);
    const totalDuration = max - min;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexShrink: 0,
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <h2 style={{
                    margin: 0,
                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span className="icon icon-waterfall" />
                    Waterfall Timeline
                </h2>
                <div style={{
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span className="icon icon-sessions" />
                    Sessions ({traces.length} of {data.sessions.length}) • Click spans for details
                </div>
            </div>

            {/* Three Panel Layout */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: selectedSpan
                    ? 'minmax(250px, 280px) 1fr minmax(300px, 350px)'  // Left sidebar, center waterfall, right panel
                    : 'minmax(250px, 280px) 1fr',       // Left sidebar, full center waterfall
                gap: 'clamp(0.75rem, 3vw, 1.5rem)',
                flex: 1,
                minHeight: 0  // Allow flex items to shrink below content size
            }}>
                {/* Left Panel - Trace Selector */}
                <div style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-primary)',
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    overflowY: 'auto',
                    transition: 'all 0.3s ease'
                }}>
                    <h3 style={{
                        margin: '0 0 16px 0',
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                        fontWeight: '600',
                        color: 'var(--text-primary)'
                    }}>
                        Select Trace
                    </h3>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        {traces.map(trace => (
                            <button
                                key={trace.traceId}
                                onClick={() => {
                                    setSelectedTraceId(trace.traceId);
                                    setSelectedSpan(null); // Clear span selection when changing trace
                                }}
                                style={{
                                    padding: 'clamp(0.5rem, 2vw, 0.75rem)',
                                    backgroundColor: selectedTraceId === trace.traceId ? 'var(--accent-primary)' : 'var(--bg-primary)',
                                    border: selectedTraceId === trace.traceId ? '2px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'all 0.2s',
                                    fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
                                    color: selectedTraceId === trace.traceId ? 'white' : 'var(--text-primary)'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedTraceId !== trace.traceId) {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                                        e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedTraceId !== trace.traceId) {
                                        e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                                        e.currentTarget.style.borderColor = 'var(--border-primary)';
                                    }
                                }}
                            >
                                <div style={{
                                    fontWeight: '500',
                                    color: selectedTraceId === trace.traceId ? 'white' : 'var(--text-primary)',
                                    marginBottom: '4px'
                                }}>
                                    {trace.sessionId}
                                </div>
                                <div style={{
                                    color: selectedTraceId === trace.traceId ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <span>{formatDuration(trace.duration)}</span>
                                    <span>•</span>
                                    <Badge variant={trace.success ? 'success' : 'error'}>
                                        {trace.success ? '✓' : '✗'}
                                    </Badge>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Center Panel - Waterfall Visualization */}
                <div style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-primary)',
                    padding: 'clamp(1rem, 3vw, 1.25rem)',
                    overflowY: 'auto',
                    transition: 'all 0.3s ease'
                }}>
                    {selectedTrace && selectedSpans.length > 0 ? (
                        <>
                            {/* Trace Info */}
                            <div style={{
                                marginBottom: '20px',
                                padding: 'clamp(0.75rem, 2vw, 1rem)',
                                backgroundColor: 'var(--bg-secondary)',
                                borderRadius: '6px',
                                border: '1px solid var(--border-primary)',
                                transition: 'all 0.3s ease'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem'
                                }}>
                                    <div>
                                        <h3 style={{
                                            margin: 0,
                                            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                            fontWeight: '600',
                                            color: 'var(--text-primary)'
                                        }}>
                                            {selectedTrace.sessionId}
                                        </h3>
                                        <div style={{
                                            fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
                                            color: 'var(--text-secondary)',
                                            marginTop: '4px'
                                        }}>
                                            {selectedTrace.userId} • {selectedTrace.sessionType} • {formatDuration(selectedTrace.duration)}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        flexWrap: 'wrap'
                                    }}>
                                        <span style={{
                                            fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)',
                                            color: 'var(--text-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <span className="icon icon-spans" />
                                            {selectedSpans.length} spans
                                        </span>
                                        <Badge variant={selectedTrace.success ? 'success' : 'error'}>
                                            {selectedTrace.success ? 'Success' : 'Failed'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {selectedSpans.map((span, index) => {
                                    const startTime = new Date(span.startTime).getTime();
                                    const leftPercent = ((startTime - min) / totalDuration) * 100;
                                    const widthPercent = Math.max((span.duration / totalDuration) * 100, 0.5);

                                    return (
                                        <button
                                            key={span.spanId}
                                            onClick={() => setSelectedSpan(span)}
                                            style={{
                                                width: '100%',
                                                display: 'grid',
                                                gridTemplateColumns: 'minmax(150px, 200px) 1fr minmax(80px, 100px)',
                                                alignItems: 'center',
                                                gap: 'clamp(0.5rem, 2vw, 0.75rem)',
                                                padding: 'clamp(0.5rem, 2vw, 0.625rem)',
                                                borderRadius: '0', // Remove rounded corners
                                                border: 'none',
                                                borderBottom: selectedSpan?.spanId === span.spanId ? '3px solid var(--accent-primary)' : '1px solid var(--border-primary)',
                                                backgroundColor: selectedSpan?.spanId === span.spanId ? 'var(--bg-secondary)' : 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                textAlign: 'left',
                                                color: 'var(--text-primary)'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedSpan?.spanId !== span.spanId) {
                                                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedSpan?.spanId !== span.spanId) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }
                                            }}
                                        >
                                            {/* Operation name */}
                                            <div>
                                                <div style={{
                                                    fontSize: '13px',
                                                    fontWeight: '500',
                                                    color: 'var(--text-primary)',
                                                    marginBottom: '2px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {span.operationName}
                                                </div>
                                                <div style={{
                                                    fontSize: '11px',
                                                    color: 'var(--text-secondary)'
                                                }}>
                                                    {span.agentType && `${span.agentType} agent`}
                                                </div>
                                            </div>

                                            {/* Timeline bar */}
                                            <div style={{
                                                position: 'relative',
                                                height: '24px',
                                                backgroundColor: 'var(--bg-secondary)',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    left: `${leftPercent}%`,
                                                    width: `${widthPercent}%`,
                                                    height: '100%',
                                                    backgroundColor: span.success ? 'var(--success)' : 'var(--error)',
                                                    borderRadius: '3px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    minWidth: '2px'
                                                }}>
                                                    {widthPercent > 10 && (
                                                        <span style={{
                                                            fontSize: '9px',
                                                            color: 'white',
                                                            fontWeight: '500'
                                                        }}>
                                                            {formatDuration(span.duration)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Duration and status */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '6px'
                                            }}>
                                                <span style={{
                                                    fontSize: '11px',
                                                    color: 'var(--text-secondary)',
                                                    fontFamily: 'monospace'
                                                }}>
                                                    {formatDuration(span.duration)}
                                                </span>
                                                <Badge variant={span.success ? 'success' : 'error'}>
                                                    {span.success ? '✓' : '✗'}
                                                </Badge>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Timeline Summary */}
                            <div style={{
                                marginTop: '16px',
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderTop: '1px solid var(--border-primary)',
                                paddingTop: '12px'
                            }}>
                                <span>Start: {formatTime(new Date(min))}</span>
                                <span style={{ fontWeight: '500' }}>Total: {formatDuration(totalDuration)}</span>
                                <span>End: {formatTime(new Date(max))}</span>
                            </div>
                        </>
                    ) : (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '300px',
                            color: 'var(--text-secondary)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏱️</div>
                            <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                                {selectedTrace ? 'No spans found' : 'Select a trace'}
                            </div>
                            <div style={{ fontSize: '14px' }}>
                                {selectedTrace
                                    ? 'This trace has no spans to visualize'
                                    : 'Choose a trace from the left panel to view timeline'
                                }
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Span Details */}
                {selectedSpan && (
                    <div style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-primary)',
                        padding: '20px',
                        overflowY: 'auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                Span Details
                            </h3>
                            <button
                                onClick={() => setSelectedSpan(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    color: 'var(--text-secondary)',
                                    padding: '4px'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                    Operation Name
                                </label>
                                <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                    {selectedSpan.operationName}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                    Status
                                </label>
                                <div style={{ marginTop: '4px' }}>
                                    <Badge variant={selectedSpan.success ? 'success' : 'error'}>
                                        {selectedSpan.success ? 'Success' : 'Error'}
                                    </Badge>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                    Duration
                                </label>
                                <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                    {formatDuration(selectedSpan.duration)}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                    Start Time
                                </label>
                                <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                    {new Date(selectedSpan.startTime).toLocaleString()}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                    End Time
                                </label>
                                <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                    {new Date(selectedSpan.endTime).toLocaleString()}
                                </div>
                            </div>

                            {selectedSpan.agentType && (
                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                        Agent Type
                                    </label>
                                    <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                        {selectedSpan.agentType}
                                    </div>
                                </div>
                            )}

                            {selectedSpan.model && (
                                <div>
                                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                        LLM Model
                                    </label>
                                    <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                        {selectedSpan.model}
                                    </div>
                                </div>
                            )}

                            {selectedSpan.inputTokens && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                            Input Tokens
                                        </label>
                                        <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                            {selectedSpan.inputTokens.toLocaleString()}
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                            Output Tokens
                                        </label>
                                        <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px' }}>
                                            {(selectedSpan.outputTokens || 0).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                    Attributes
                                </label>
                                <div style={{
                                    marginTop: '8px',
                                    padding: '12px',
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontFamily: 'monospace',
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}>
                                    {Object.entries(selectedSpan.attributes || {})
                                        .map(([key, value]) => (
                                            <div key={key} style={{ marginBottom: '6px' }}>
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
        </div>
    );
}