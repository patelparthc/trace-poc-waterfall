import React, { useState, useEffect, useMemo } from 'react';
import { generateSampleTraceData } from '../data/sampleDataGenerator';
import OverviewTab from './tabs/OverviewTab';
import SessionsTab from './tabs/SessionsTab';
import SpansTab from './tabs/SpansTab';
import TracesTab from './tabs/TracesTab';
import WaterfallTab from './tabs/WaterfallTab';
import type { DashboardData, Span, TabType } from '../types';

type Theme = 'light' | 'dark' | 'auto';

export default function ModernDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [selectedSpan, setSelectedSpan] = useState<Span | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>('auto');

    // Theme toggle functionality
    useEffect(() => {
        const savedTheme = localStorage.getItem('dashboard-theme') as Theme || 'auto';
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (newTheme: Theme) => {
        const root = document.documentElement;
        
        if (newTheme === 'auto') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', newTheme);
        }
        
        localStorage.setItem('dashboard-theme', newTheme);
    };

    const toggleTheme = () => {
        let newTheme: Theme;
        if (theme === 'light') {
            newTheme = 'dark';
        } else if (theme === 'dark') {
            newTheme = 'auto';
        } else {
            newTheme = 'light';
        }
        setTheme(newTheme);
        applyTheme(newTheme);
    };

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
                backgroundColor: 'var(--bg-primary)',
                fontFamily: '"Open Sans", system-ui, -apple-system, sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid var(--border-primary)',
                        borderTop: '4px solid var(--accent-primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <div style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                        <span className="icon icon-chart" style={{ marginRight: '8px' }} />
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
                justifyContent: 'center',
                backgroundColor: 'var(--bg-primary)'
            }}>
                <div style={{ color: 'var(--error)', fontSize: '18px', textAlign: 'center' }}>
                    <span className="icon icon-error" style={{ marginRight: '8px' }} />
                    Error loading dashboard data
                </div>
            </div>
        );
    }

    const tabs: { key: TabType; label: string; icon: string; count?: number }[] = [
        { key: 'overview', label: 'Overview', icon: 'icon-overview' },
        { key: 'sessions', label: 'Sessions', icon: 'icon-sessions', count: metrics.totalSessions },
        { key: 'spans', label: 'Spans', icon: 'icon-spans', count: metrics.totalSpans },
        { key: 'traces', label: 'Traces', icon: 'icon-traces', count: data.sessions.length },
        { key: 'waterfall', label: 'Waterfall', icon: 'icon-waterfall' }
    ];

    // Helper for tab count formatting
    const formatTabCount = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const getThemeIcon = (): string => {
        if (theme === 'light') return 'icon-theme-light';
        if (theme === 'dark') return 'icon-theme';
        return 'icon-settings';
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
            backgroundColor: 'var(--bg-primary)',
            fontFamily: '"Open Sans", system-ui, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'background-color 0.3s ease'
        }}>
            {/* Header */}
            <div style={{
                borderBottom: '1px solid var(--border-primary)',
                backgroundColor: 'var(--bg-primary)',
                padding: '0 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '64px',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span className="icon icon-chart" />
                        OpenTelemetry Dashboard
                    </h1>
                    <p style={{
                        margin: '4px 0 0 0',
                        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                        color: 'var(--text-secondary)'
                    }}>
                        Agentic AI System Observability
                    </p>
                </div>

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    flex: '0 0 auto'
                }}>
                    <div style={{ 
                        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', 
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                    }}>
                        <span className="icon icon-time" />
                        <span style={{ position: 'absolute', width: '1px', height: '1px', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)' }}>Last updated:</span>
                        {new Date().toLocaleTimeString()}
                    </div>
                    
                    {/* Theme toggle button */}
                    <button
                        onClick={toggleTheme}
                        style={{
                            background: 'none',
                            border: '1px solid var(--border-primary)',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            color: 'var(--text-secondary)',
                            transition: 'all 0.2s ease',
                            fontSize: '1rem',
                            minWidth: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title={`Current theme: ${theme}. Click to cycle through light/dark/auto modes.`}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                            e.currentTarget.style.borderColor = 'var(--accent-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'var(--border-primary)';
                        }}
                    >
                        <span className={`icon ${getThemeIcon()}`} />
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{
                borderBottom: '1px solid var(--border-primary)',
                backgroundColor: 'var(--bg-primary)',
                padding: '0 1rem',
                overflowX: 'auto',
                overflowY: 'hidden'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                    minWidth: 'max-content'
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
                                    padding: 'clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 3vw, 1.25rem)',
                                    cursor: 'pointer',
                                    fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                                    fontWeight: '500',
                                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    borderBottom: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'clamp(0.25rem, 1vw, 0.5rem)',
                                    whiteSpace: 'nowrap',
                                    position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <span className={`icon ${tab.icon}`} />
                                <span>{tab.label}</span>
                                {tab.count !== undefined && (
                                    <span style={{
                                        backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                                        color: 'white',
                                        fontSize: 'clamp(0.625rem, 1.25vw, 0.75rem)',
                                        padding: 'clamp(1px, 0.5vw, 2px) clamp(4px, 1vw, 6px)',
                                        borderRadius: 'clamp(8px, 2vw, 10px)',
                                        minWidth: 'clamp(16px, 4vw, 20px)',
                                        textAlign: 'center',
                                        lineHeight: '1.2',
                                        transition: 'all 0.3s ease'
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
                backgroundColor: 'var(--bg-secondary)',
                transition: 'background-color 0.3s ease'
            }}>
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    {renderTabContent()}
                </div>
            </div>

            {/* CSS Keyframes and responsive styles */}
            <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                
                @keyframes fadeIn {
                  0% { opacity: 0; transform: translateY(10px); }
                  100% { opacity: 1; transform: translateY(0); }
                }
                
                /* Mobile specific adjustments */
                @media (max-width: 768px) {
                  .container {
                    padding: 0 0.75rem;
                  }
                }
                
                /* High DPI screen adjustments */
                @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                  .icon {
                    font-size: 0.9em;
                  }
                }
      `}</style>
        </div>
    );
}