# Agentic OpenTelemetry Dashboard - Requirements & Implementation Guide

## Project Overview

This project implements a comprehensive proof-of-concept for visualizing OpenTelemetry traces from agentic AI systems. It provides enterprise-grade observability for multi-agent workflows, LLM interactions, and complex AI system operations.

## Core Requirements

### 1. **Data Generation Requirements**
- Generate **1000+ realistic trace records** with hierarchical structure
- **Multi-session evaluation** with varying complexity levels:
  - 30% long complex sessions (10-30 minutes, 15-40 tasks)
  - 40% medium sessions (2-10 minutes, 8-20 tasks)
  - 30% short sessions (30 seconds - 2 minutes, 2-8 tasks)
- **Realistic error patterns** with cascading failures
- **Multiple agent types**: research, code, planning, communication, data, monitoring
- **Rich telemetry data** including LLM calls, tool usage, and performance metrics

### 2. **Dashboard Visualization Requirements**
- **5 main tabs**: Overview, Sessions, Spans, Traces, Waterfall
- **Interactive metric cards** with hover effects and real-time data
- **Professional table views** with clickable rows and proper pagination
- **Waterfall timeline visualization** similar to Jaeger/Zipkin
- **Detailed span inspection panel** with comprehensive information
- **Clean, modern UI** with white background and dark text (no gradients/glassmorphism)

### 3. **Technical Requirements**
- **React 19** with modern hooks and functional components
- **Vite** build system for fast development
- **OpenTelemetry SDK** with proper semantic conventions
- **Custom data table components** (no external grid dependencies)
- **Responsive design** with fullscreen layout
- **Open Sans font** for professional appearance

## Sample Data Structure

### Session Structure
```javascript
{
  sessionId: "uuid-v4",
  userId: "user-001",
  sessionType: "interactive|batch|automated|collaborative",
  startTime: Date,
  endTime: Date,
  duration: 120000, // milliseconds
  numTasks: 15,
  numAgents: 3,
  success: true,
  totalTokens: 12500,
  traceId: "session-trace-id"
}
```

### Span Structure
```javascript
{
  traceId: "uuid-v4",
  spanId: "uuid-v4",
  parentSpanId: "parent-uuid-v4",
  operationName: "agent-task:code-generation",
  startTime: Date,
  endTime: Date,
  duration: 5000,
  agentId: "code-agent-1",
  agentType: "code-agent",
  taskType: "code-generation",
  success: true,
  attributes: {
    'ai.agent.id': "code-agent-1",
    'ai.agent.type': "code-agent",
    'ai.session.id': "session-uuid",
    'task.description': "Create a React component for user authentication",
    'error.type': "timeout" // only for failed spans
  }
}
```

### LLM Span Structure
```javascript
{
  traceId: "uuid-v4",
  spanId: "uuid-v4",
  parentSpanId: "task-span-id",
  operationName: "llm:gpt-4",
  model: "gpt-4",
  inputTokens: 1500,
  outputTokens: 800,
  duration: 2500,
  success: true,
  attributes: {
    'ai.llm.model': "gpt-4",
    'ai.token.count.input': 1500,
    'ai.token.count.output': 800,
    'llm.duration_ms': 2500
  }
}
```

## UI/UX Requirements

### Design Specifications
- **Color Scheme**: White backgrounds (#ffffff), dark text (#1f2937, #4b5563, #6b7280)
- **Typography**: Open Sans font family throughout
- **Layout**: Fullscreen dashboard with clean borders and subtle shadows
- **Interactive Elements**: Hover effects, clickable rows, smooth transitions
- **Error States**: Red color coding (#dc2626) for failures
- **Success States**: Green color coding (#16a34a) for success

### Component Requirements
- **MetricCard**: Hover lift effect, large numbers, icon display
- **TableRow**: Hover background change, smooth cursor transition
- **Badge**: Color-coded status indicators (success/error/default)
- **Waterfall View**: Proportional duration bars, color-coded by operation type
- **Span Details Panel**: Comprehensive information with close button

## Implementation Examples

### Example Prompt for Similar Projects
```
Create a comprehensive OpenTelemetry dashboard for agentic AI systems with the following requirements:

1. Generate 1000+ realistic trace samples with multi-session evaluation
2. Include 6 agent types: research, code, planning, communication, data, monitoring
3. Create complex session hierarchies with 15-40 tasks for long sessions
4. Implement realistic error patterns with cascading failures
5. Build 5 main dashboard tabs: Overview, Sessions, Spans, Traces, Waterfall
6. Use React 19 + Vite with modern functional components
7. Design clean UI with white background, dark text, Open Sans font
8. Create interactive waterfall view with detailed span inspection panel
9. Include LLM call tracking with token counts and model information
10. Add tool usage spans with input/output size tracking

The dashboard should look professional like Jaeger/Zipkin but specialized for AI agent workflows.
```

### Key Implementation Patterns
```javascript
// Data Generation Pattern
export function generateSampleTraceData(numRecords = 1000) {
  // Create fewer sessions (15%) to generate longer traces
  const numSessions = Math.floor(numRecords * 0.15);

  // Vary session complexity
  if (Math.random() > 0.7) {
    // 30% complex sessions
    sessionDuration = randomInt(600000, 1800000);
    numTasks = randomInt(15, 40);
    successRate = Math.random() > 0.25;
  }

  // Generate hierarchical spans with proper parent-child relationships
  // Include error propagation logic
  // Add LLM and tool usage spans as children
}

// Component Pattern
const MetricCard = ({ title, value, color, icon }) => (
  <div style={{
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
    transition: 'all 0.3s ease',
    cursor: 'default',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}>
    {/* Card content */}
  </div>
);
```

## Detailed Architecture Guide

### File Structure
```
src/
├── components/
│   ├── ModernDashboard.jsx        # Main dashboard component
│   └── SimpleTable.jsx            # Custom table component
├── data/
│   └── sampleDataGenerator.js     # Trace data generation
├── telemetry/
│   └── otelConfig.js              # OpenTelemetry configuration
└── App.jsx                        # Application entry point
```

### Component Hierarchy
1. **ModernDashboard** (Main Component)
   - Tab Navigation System
   - Overview Tab with Metric Cards
   - Sessions Table with Click Handler
   - Spans Table with Trace Navigation
   - Traces Table with Waterfall Navigation
   - Waterfall View with Timeline and Details Panel

2. **Data Flow**
   - Generate sample data on component mount
   - Analyze data for metrics and statistics
   - Handle user interactions (clicks, selections)
   - Update UI state based on user actions

### Error Handling Patterns
- **Cascading Failures**: Later tasks more likely to fail in failed sessions
- **Error Propagation**: Tool and LLM failures inherit from parent task failures
- **Error Types**: timeout, resource_limit, validation_error, dependency_failure, rate_limit, context_length

### Performance Considerations
- **Data Pagination**: Limit table views to 20 rows initially
- **Efficient Rendering**: Use proper React keys and avoid unnecessary re-renders
- **Memory Management**: Generate data once and reuse throughout session
- **Responsive Design**: Handle different screen sizes gracefully

## Copilot Instructions for Future Development

When working on similar agentic telemetry dashboards, use these instructions:

### For Data Generation:
```
Generate realistic OpenTelemetry trace data for agentic systems:
- Create hierarchical spans with parent-child relationships
- Include multiple agent types with realistic task durations
- Add LLM spans with token counts and model information
- Include tool usage spans with input/output sizes
- Implement error propagation patterns for realistic failure scenarios
- Vary session complexity (30% complex, 40% medium, 30% simple)
```

### For UI Components:
```
Create modern dashboard components with:
- Clean white backgrounds, no gradients or glassmorphism
- Open Sans font family throughout
- Interactive hover effects with smooth transitions
- Color-coded badges for status indication
- Professional table layouts with clickable rows
- Responsive design that works on all screen sizes
```

### For Waterfall Visualization:
```
Implement trace waterfall view similar to Jaeger:
- Proportional duration bars based on span timing
- Color coding by operation type (LLM, tool, agent-task)
- Interactive span selection with detailed information panel
- Hierarchical display showing parent-child relationships
- Timeline axis with relative timing information
```

### For Error Handling:
```
Implement realistic error patterns:
- Cascading failures where later operations fail after early failures
- Different error types for different operation types
- Proper error state visualization with red color coding
- Error propagation from parent to child spans
- Recovery scenarios where some spans succeed after failures
```

## Checklist for Implementation

### Phase 1: Setup & Data Generation
- [ ] Initialize React 19 + Vite project
- [ ] Install OpenTelemetry dependencies
- [ ] Create sample data generator with 1000+ records
- [ ] Implement hierarchical span structure
- [ ] Add realistic error patterns

### Phase 2: Basic Dashboard
- [ ] Create main dashboard component
- [ ] Implement tab navigation system
- [ ] Add overview page with metric cards
- [ ] Create custom table components
- [ ] Add basic data visualization

### Phase 3: Advanced Features
- [ ] Implement waterfall timeline view
- [ ] Add span details inspection panel
- [ ] Create interactive click handlers
- [ ] Add proper error state visualization
- [ ] Implement responsive design

### Phase 4: Polish & Performance
- [ ] Apply clean UI styling (white bg, dark text)
- [ ] Add hover effects and transitions
- [ ] Optimize rendering performance
- [ ] Test on different screen sizes
- [ ] Add comprehensive error handling

## Future Enhancements

### Potential Additional Features
- **Real-time Data**: WebSocket integration for live trace updates
- **Filtering & Search**: Advanced filtering by agent type, duration, status
- **Export Functionality**: Export traces to JSON, CSV formats
- **Alerting System**: Notifications for error rate thresholds
- **Performance Analytics**: Trend analysis and performance insights
- **Multi-tenancy**: Support for multiple organizations/projects

### Integration Possibilities
- **Jaeger Integration**: Connect to real Jaeger backend
- **Prometheus Metrics**: Add metrics collection and alerting
- **Grafana Dashboards**: Create complementary monitoring dashboards
- **Log Aggregation**: Integrate with ELK stack or similar
- **CI/CD Integration**: Trace analysis in deployment pipelines

This comprehensive guide provides everything needed to recreate or extend this agentic OpenTelemetry dashboard, with clear requirements, examples, and implementation guidance.