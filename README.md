# Agentic OpenTelemetry Dashboard

A comprehensive proof-of-concept dashboard for visualizing OpenTelemetry traces from agentic AI systems. Built with React 19, this dashboard provides enterprise-grade observability for multi-agent workflows, LLM interactions, and complex AI system operations.

## 🚀 Live Demo

**[Try the Interactive Demo →](https://patelparthc.github.io/trace-poc-waterfall/)**

Experience the full dashboard with 1200+ realistic trace samples, interactive waterfall visualization, and comprehensive agent workflow analysis.

---

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React Version](https://img.shields.io/badge/React-19.0-blue)
![Build](https://img.shields.io/badge/Build-Vite-purple)
![Demo](https://img.shields.io/badge/Demo-Live-success)

## Features

### **Comprehensive Data Visualization**

- **1200+ realistic trace records** with multi-session evaluation
- **Complex session hierarchies** (10-30 minute sessions with 15-40 tasks)
- **6 agent types**: research, code, planning, communication, data, monitoring
- **Realistic error patterns** with cascading failures

### **Professional Dashboard Views**

- **Overview Tab**: Interactive metric cards with hover effects
- **Sessions Tab**: Clickable session management with duration analysis
- **Spans Tab**: Detailed span inspection with agent type filtering
- **Traces Tab**: Trace-level analysis with error counting
- **Waterfall Tab**: Timeline visualization with detailed span inspection panel

### **Modern UI/UX**

- Clean white background with professional dark text
- Open Sans typography for enterprise appearance
- Interactive hover effects and smooth transitions
- Responsive fullscreen layout
- Color-coded status indicators

### **Advanced Trace Analysis**

- **Waterfall Timeline**: Proportional duration bars like Jaeger/Zipkin
- **Span Details Panel**: Comprehensive span information including:
  - Basic information (operation, duration, status)
  - Timing data with relative timestamps
  - LLM details (model, token counts)
  - Tool usage information
  - Error details with error types
  - Complete OpenTelemetry attributes
  - Hierarchy information (trace/span/parent IDs)

## Quick Start

### Option 1: Try the Live Demo

**[🌐 Launch Interactive Demo](https://patelparthc.github.io/trace-poc-waterfall/)**

No installation required! The live demo includes all features with pre-generated trace data.

### Option 2: Run Locally

#### Prerequisites

- Node.js 18+
- npm or yarn

#### Installation

```bash
# Clone the repository
git clone https://github.com/patelparthc/trace-poc-waterfall.git
cd trace-poc-waterfall

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

#### Live Demo

Visit **[https://patelparthc.github.io/trace-poc-waterfall/](https://patelparthc.github.io/trace-poc-waterfall/)** to explore the dashboard instantly.

#### Local Development

1. Open your browser to `http://localhost:3000`
2. The dashboard will automatically generate 1200+ sample trace records
3. Navigate between tabs to explore different views
4. Click on sessions, spans, or traces to view detailed information
5. Use the waterfall view to analyze trace timelines and click spans for detailed inspection

## Dashboard Tabs Overview

### 1. **Overview Tab**

- **Total Sessions**: Count of all evaluation sessions
- **Total Spans**: Count of all trace spans across sessions
- **Success Rate**: Percentage of successful operations
- **Average Duration**: Mean session duration across all sessions
- **Session Statistics**: Detailed breakdown of tasks, tokens, and agent types
- **Top Agent Types**: Most frequently used agents in the system

### 2. **Sessions Tab**

Interactive table showing:

- Session ID (clickable - navigates to waterfall view)
- User information and session type
- Duration and task count
- Token consumption
- Success/failure status

### 3. **Spans Tab**

Detailed span analysis with:

- Trace ID (clickable - navigates to waterfall view)
- Operation names and agent types
- Duration and success status
- Agent type filtering capabilities

### 4. **Traces Tab**

Trace-level overview including:

- Trace ID (clickable - navigates to waterfall view)
- Span count per trace
- Total trace duration
- Error count and success indicators
- Start time information

### 5. **Waterfall Tab**

Advanced timeline visualization:

- **Left Panel**: Waterfall timeline with proportional duration bars
- **Right Panel**: Detailed span inspection (appears when span is selected)
- Color-coded operations (LLM calls, tool usage, agent tasks)
- Interactive span selection
- Comprehensive span details including attributes

## Architecture

### Core Components

#### `ModernDashboard.jsx`

Main dashboard component handling:

- Tab navigation state management
- Data loading and analysis
- User interaction handling (clicks, selections)
- Layout and styling coordination

#### `sampleDataGenerator.js`

Sophisticated data generation with:

- **Complex Session Types**: 30% long, 40% medium, 30% short sessions
- **Realistic Error Patterns**: Cascading failures, error propagation
- **Agent Workflows**: Multi-step processes with tool usage and LLM calls
- **OpenTelemetry Standards**: Proper semantic conventions and attributes

#### `otelConfig.js`

OpenTelemetry configuration:

- AI-specific semantic conventions
- Custom span attributes for agentic systems
- Telemetry context management

### Data Structure

#### Session Data

```javascript
{
  sessionId: "uuid-v4",
  userId: "user-001",
  sessionType: "interactive",
  duration: 450000,
  numTasks: 25,
  success: true,
  totalTokens: 15000
}
```

#### Span Data

```javascript
{
  traceId: "uuid-v4",
  spanId: "uuid-v4",
  operationName: "agent-task:code-generation",
  agentType: "code-agent",
  duration: 5000,
  success: true,
  attributes: {
    'ai.agent.type': 'code-agent',
    'task.description': 'Create React component',
    'error.type': 'timeout' // for failed spans
  }
}
```

## Use Cases

### 1. **AI System Debugging**

- Trace complex multi-agent workflows
- Identify performance bottlenecks
- Debug failed agent interactions
- Analyze error propagation patterns

### 2. **Performance Analysis**

- Monitor LLM token consumption
- Track tool usage patterns
- Analyze session duration trends
- Identify optimization opportunities

### 3. **System Monitoring**

- Track success rates across agents
- Monitor system health metrics
- Alert on error rate increases
- Capacity planning insights

### 4. **Development Insights**

- Understand agent interaction patterns
- Optimize workflow orchestration
- Improve error handling strategies
- Performance tuning guidance

## Customization

### Adding New Agent Types

```javascript
// In sampleDataGenerator.js
const AGENT_TYPES = [
  { type: "your-agent", avgTaskDuration: 4000, toolUsage: ["your-tool"] },
  // ... existing agents
];
```

### Custom Error Types

```javascript
// Add new error types for more realistic scenarios
'error.type': randomChoice([
  'your_custom_error',
  'network_timeout',
  'memory_limit'
])
```

### Styling Customization

The dashboard uses a clean, professional design system:

- **Colors**: White backgrounds, dark text (#1f2937, #4b5563, #6b7280)
- **Typography**: Open Sans font family
- **Layout**: CSS-in-JS with responsive design
- **Interactions**: Hover effects, smooth transitions

## Sample Data Characteristics

### Session Distribution

- **30% Complex Sessions**: 10-30 minutes, 15-40 tasks, 75% success rate
- **40% Medium Sessions**: 2-10 minutes, 8-20 tasks, 85% success rate
- **30% Simple Sessions**: 30s-2 minutes, 2-8 tasks, 95% success rate

### Error Patterns

- **Cascading Failures**: Later tasks fail when sessions have errors
- **Tool Failures**: Inherit from parent task failures
- **LLM Failures**: Rate limiting, context length, safety filters
- **Workflow Errors**: Dependency failures, timeouts, resource exhaustion

### Agent Types & Tools

- **Research Agent**: web-search, document-analyzer, knowledge-base
- **Code Agent**: code-editor, compiler, debugger, git
- **Planning Agent**: task-planner, priority-analyzer, resource-allocator
- **Communication Agent**: email-client, slack-api, notification-service
- **Data Agent**: database, data-processor, visualization-tool
- **Monitoring Agent**: metrics-collector, alert-manager, log-analyzer

## Future Enhancements

### Planned Features

- **Real-time Updates**: WebSocket integration for live trace streaming
- **Advanced Filtering**: Filter by agent type, duration, error type
- **Export Capabilities**: JSON, CSV, and PDF export options
- **Alerting System**: Configurable alerts for error rates and performance
- **Historical Analysis**: Trend analysis and performance insights over time

### Integration Opportunities

- **Jaeger Backend**: Connect to real Jaeger/OTEL collectors
- **Prometheus**: Add metrics collection and alerting
- **Grafana**: Create complementary monitoring dashboards
- **ELK Stack**: Integrate with log aggregation systems

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style and patterns
4. Add tests for new functionality
5. Update documentation as needed
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or contributions:

- Create an issue in the GitHub repository
- Review the REQUIREMENTS.md for detailed implementation guidance
- Check existing issues for similar problems

## Key Takeaways

This dashboard demonstrates:

- **Enterprise-grade observability** for agentic AI systems
- **Modern React patterns** with hooks and functional components
- **Professional UI/UX design** suitable for production environments
- **Realistic data modeling** that mirrors real-world AI system complexity
- **Extensible architecture** that can be adapted for various use cases

Perfect for teams building multi-agent AI systems who need comprehensive observability and debugging capabilities.
