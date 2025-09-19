import React, { useState, useEffect, useMemo } from 'react';
import { generateSampleTraceData } from '../data/sampleDataGenerator';
import OverviewTab from './tabs/OverviewTab';
import SessionsTab from './tabs/SessionsTab';
import SpansTab from './tabs/SpansTab';
import TracesTab from './tabs/TracesTab';
import WaterfallTab from './tabs/WaterfallTab';
import type { DashboardData, Span, TabType } from '../types';

export default function ModernDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [selectedSpan, setSelectedSpan] = useState<Span | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    // Handle navigation to waterfall with selected session
    const handleNavigateToWaterfall = (sessionId: string) => {
        setSelectedSessionId(sessionId);
        setActiveTab('waterfall');
    };

    // Generate sample data on mount
    useEffect(() => {
        console.log('Generating OpenTelemetry sample data...');
        const startTime = performance.now();

        const sampleData = generateSampleTraceData(150);

        const endTime = performance.now();
        console.log(`Data generation completed in ${(endTime - startTime).toFixed(2)}ms`);
        console.log(`Generated:`, {
            sessions: sampleData.sessions.length,
            spans: sampleData.spans.length,
            timeRange: sampleData.summary.timeRange
        });

        setData(sampleData);
        setIsLoading(false);
    }, []);

    // Memoized metrics calculations
    const metrics = useMemo(() => {
        if (!data) return null;

        const totalSpans = data.spans.length;
        const successfulSpans = data.spans.filter(span => span.success).length;
        const errorSpans = totalSpans - successfulSpans;
        const successRate = ((successfulSpans / totalSpans) * 100).toFixed(1);

        const totalSessions = data.sessions.length;
        const successfulSessions = data.sessions.filter(session => session.success).length;
        const sessionSuccessRate = ((successfulSessions / totalSessions) * 100).toFixed(1);

        const avgDuration = data.spans.reduce((acc, span) => acc + span.duration, 0) / totalSpans;
        const totalTokens = data.sessions.reduce((acc, session) => acc + session.totalTokens, 0);

        // LLM specific metrics
        const llmSpans = data.spans.filter(span => span.model);
        const totalInputTokens = llmSpans.reduce((acc, span) => acc + (span.inputTokens || 0), 0);
        const totalOutputTokens = llmSpans.reduce((acc, span) => acc + (span.outputTokens || 0), 0);

        // Agent metrics
        const agentSpans = data.spans.filter(span => span.agentType);
        const agentTypeMap = agentSpans.reduce((acc: Record<string, number>, span) => {
            if (span.agentType) {
                acc[span.agentType] = (acc[span.agentType] || 0) + 1;
            }
            return acc;
        }, {});

        return {
            totalSpans,
            successfulSpans,
            errorSpans,
            successRate,
            totalSessions,
            successfulSessions,
            sessionSuccessRate,
            avgDuration,
            totalTokens,
            totalInputTokens,
            totalOutputTokens,
            llmSpansCount: llmSpans.length,
            agentSpansCount: agentSpans.length,
            agentTypeMap
        };
    }, [data]);

    if (isLoading) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffffff',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #e5e7eb',
                        borderTop: '4px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <div style={{ color: '#6b7280', fontSize: '16px' }}>
                        Generating OpenTelemetry Data...
                    </div>
                </div>
            </div>
        );
    }

    if (!data || !metrics) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ color: '#ef4444', fontSize: '18px' }}>
                    Error loading dashboard data
                </div>
            </div>
        );
    }

    const tabs: { key: TabType; label: string; count?: number }[] = [
        { key: 'overview', label: 'Overview' },
        { key: 'sessions', label: 'Sessions', count: metrics.totalSessions },
        { key: 'spans', label: 'Spans', count: metrics.totalSpans },
        { key: 'traces', label: 'Traces', count: data.sessions.length },
        { key: 'waterfall', label: 'Waterfall' }
    ];

    // Helper for tab count formatting
    const formatTabCount = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const renderTabContent = (): React.ReactNode => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab data={data} metrics={metrics} />;

            case 'sessions':
                return <SessionsTab
                    data={data}
                    totalSessions={metrics.totalSessions}
                    onNavigateToWaterfall={handleNavigateToWaterfall}
                />;

            case 'spans':
                return (
                    <SpansTab
                        data={data}
                        totalSpans={metrics.totalSpans}
                        selectedSpan={selectedSpan}
                        onSpanSelect={setSelectedSpan}
                        onSpanDeselect={() => setSelectedSpan(null)}
                    />
                );

            case 'traces':
                return <TracesTab data={data} />;

            case 'waterfall':
                return <WaterfallTab data={data} selectedSessionId={selectedSessionId} />;

            default:
                return null;
        }
    };

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#ffffff',
            fontFamily: '"Open Sans", system-ui, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                padding: '0 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '64px'
            }}>
                <div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#1f2937'
                    }}>
                        OpenTelemetry Dashboard
                    </h1>
                    <p style={{
                        margin: '4px 0 0 0',
                        fontSize: '14px',
                        color: '#6b7280'
                    }}>
                        Agentic AI System Observability
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                padding: '0 32px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '16px 20px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: isActive ? '#3b82f6' : '#6b7280',
                                    borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = '#374151';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = '#6b7280';
                                    }
                                }}
                            >
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span style={{
                                        backgroundColor: isActive ? '#3b82f6' : '#9ca3af',
                                        color: 'white',
                                        fontSize: '11px',
                                        padding: '2px 6px',
                                        borderRadius: '10px',
                                        minWidth: '20px',
                                        textAlign: 'center'
                                    }}>
                                        {formatTabCount(tab.count)}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                overflow: 'auto',
                backgroundColor: '#f9fafb'
            }}>
                {renderTabContent()}
            </div>

            {/* CSS Keyframes for loading spinner */}
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');
      `}</style>
        </div>
    );
}