# Copilot Instructions for Agentic OpenTelemetry Dashboard

## Project Context

This is a comprehensive OpenTelemetry dashboard for agentic AI systems. When working on this project or creating similar ones, follow these specific instructions to maintain consistency and quality.

## Core Development Guidelines

### 1. **Data Generation Patterns**

When generating sample telemetry data for agentic systems:

```javascript
// Always create hierarchical sessions with varying complexity
const sessionComplexity = Math.random();
if (sessionComplexity > 0.7) {
  // 30% complex sessions
  sessionDuration = randomInt(600000, 1800000); // 10-30 minutes
  numTasks = randomInt(15, 40); // Many tasks
  successRate = Math.random() > 0.25; // 75% success rate
}

// Implement cascading failure patterns
let taskSuccess;
if (sessionHasErrors && taskIndex > totalTasks * 0.6 && Math.random() > 0.7) {
  taskSuccess = false; // Later tasks fail in failed sessions
}

// Create realistic agent workflows
const agentTypes = [
  { type: 'research-agent', avgTaskDuration: 5000, toolUsage: ['web-search', 'document-analyzer'] },
  { type: 'code-agent', avgTaskDuration: 8000, toolUsage: ['code-editor', 'compiler', 'debugger'] }
];
```

### 2. **UI Component Standards**

Always follow these UI patterns:

```javascript
// Clean professional styling - no gradients or glassmorphism
const componentStyle = {
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  fontFamily: '"Open Sans", system-ui, -apple-system, sans-serif'
};

// Interactive hover effects
const hoverEffect = {
  onMouseEnter: (e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  }
};

// Color-coded badges for status
const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    success: { bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
    error: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
    default: { bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' }
  };
  // ... implementation
};
```

### 3. **OpenTelemetry Semantic Conventions**

Use these AI-specific attributes:

```javascript
// Span attributes for agentic systems
const spanAttributes = {
  'ai.agent.id': agentId,
  'ai.agent.type': agentType,
  'ai.session.id': sessionId,
  'ai.task.id': taskId,
  'task.type': taskType,
  'task.description': promptText,
  'ai.agent.state': 'executing',

  // For LLM calls
  'ai.llm.model': modelName,
  'ai.token.count.input': inputTokens,
  'ai.token.count.output': outputTokens,

  // For tools
  'ai.tool.name': toolName,
  'tool.input_size': inputSize,
  'tool.output_size': outputSize,

  // For errors
  'error.type': errorType,
  'error.message': errorMessage
};
```

### 4. **Waterfall Visualization**

When implementing trace waterfall views:

```javascript
// Calculate proportional timing bars
const leftPercent = ((span.startTime.getTime() - minTime) / totalDuration) * 100;
const widthPercent = Math.max((span.duration / totalDuration) * 100, 0.5);

// Color-code by operation type
const getSpanColor = (span) => {
  if (span.operationName.includes('llm:')) return '#8b5cf6'; // Purple for LLM
  if (span.operationName.includes('tool:')) return '#06b6d4'; // Cyan for tools
  if (span.operationName.includes('agent-task:')) return '#10b981'; // Green for tasks
  if (!span.success) return '#ef4444'; // Red for errors
  return '#6366f1'; // Default blue
};

// Interactive span selection
const handleSpanClick = (span) => {
  setSelectedSpan(selectedSpan?.spanId === span.spanId ? null : span);
};
```

### 5. **Error Handling Patterns**

Implement realistic error scenarios:

```javascript
// Define error types by operation
const errorTypes = {
  llm: ['rate_limit', 'context_length', 'safety_filter', 'timeout'],
  tool: ['api_error', 'timeout', 'invalid_input', 'rate_limit'],
  task: ['timeout', 'resource_limit', 'validation_error', 'dependency_failure'],
  workflow: ['workflow_error', 'dependency_failure', 'timeout', 'resource_exhaustion']
};

// Error propagation logic
if (!parentTaskSuccess && Math.random() > 0.6) {
  childSuccess = false; // Child operations fail when parents fail
}
```

## Design System Guidelines

### Color Palette
- **Backgrounds**: `#ffffff` (white), `#f8fafc` (light gray)
- **Text**: `#1f2937` (dark), `#4b5563` (medium), `#6b7280` (light)
- **Borders**: `#e5e7eb` (light gray)
- **Success**: `#16a34a` (green), `#dcfce7` (light green bg)
- **Error**: `#dc2626` (red), `#fef2f2` (light red bg)
- **Warning**: `#f59e0b` (amber)
- **Info**: `#3b82f6` (blue)

### Typography
- **Font Family**: `"Open Sans", system-ui, -apple-system, sans-serif`
- **Code/IDs**: `"JetBrains Mono", monospace`
- **Sizes**: 32px (hero), 24px (headers), 18px (subheaders), 14px (body), 12px (small)

### Spacing
- **Large gaps**: `24px`
- **Medium gaps**: `16px`
- **Small gaps**: `8px`
- **Component padding**: `24px` (large), `16px` (medium), `8px` (small)

## Data Structure Templates

### Session Template
```javascript
{
  sessionId: uuidv4(),
  userId: "user-001",
  sessionType: "interactive|batch|automated|collaborative",
  startTime: Date,
  endTime: Date,
  duration: Number, // milliseconds
  numTasks: Number,
  numAgents: Number,
  success: Boolean,
  totalTokens: Number,
  traceId: String // same as sessionId for root traces
}
```

### Span Template
```javascript
{
  traceId: String,
  spanId: uuidv4(),
  parentSpanId: String,
  operationName: "agent-task:|tool:|llm:",
  startTime: Date,
  endTime: Date,
  duration: Number,
  success: Boolean,

  // Agent-specific fields
  agentId?: String,
  agentType?: String,
  taskType?: String,

  // LLM-specific fields
  model?: String,
  inputTokens?: Number,
  outputTokens?: Number,

  // Tool-specific fields
  toolName?: String,

  // OpenTelemetry attributes
  attributes: {
    'ai.agent.type': String,
    'task.description': String,
    'error.type'?: String
  }
}
```

## Implementation Checklist

When creating similar dashboards:

### Phase 1: Foundation
- [ ] Set up React 19 + Vite project structure
- [ ] Install OpenTelemetry dependencies (`@opentelemetry/api`, `@opentelemetry/sdk-web`)
- [ ] Create sample data generator with realistic complexity distribution
- [ ] Implement hierarchical span structure with proper parent-child relationships

### Phase 2: Core Components
- [ ] Build main dashboard component with tab navigation
- [ ] Create metric cards with hover effects and professional styling
- [ ] Implement custom table components (avoid external grid libraries)
- [ ] Add click handlers for navigation between views

### Phase 3: Advanced Visualization
- [ ] Build waterfall timeline with proportional duration bars
- [ ] Create detailed span inspection panel with comprehensive information
- [ ] Implement color-coding by operation type
- [ ] Add interactive span selection and deselection

### Phase 4: Professional Polish
- [ ] Apply clean white background styling throughout
- [ ] Use Open Sans font family consistently
- [ ] Add smooth hover transitions and effects
- [ ] Implement responsive design for different screen sizes
- [ ] Add proper error state visualization

## Common Patterns

### Table Row Click Handler
```javascript
const renderTable = (data, columns) => {
  return (
    <tbody>
      {data.map((row, i) => {
        const hasClickHandler = columns.some(col => col.onClick);
        const clickHandler = hasClickHandler ? () => {
          const clickableColumn = columns.find(col => col.onClick);
          if (clickableColumn) clickableColumn.onClick(row);
        } : null;

        return (
          <TableRow key={i} onClick={clickHandler}>
            {/* cells */}
          </TableRow>
        );
      })}
    </tbody>
  );
};
```

### Metric Card Pattern
```javascript
const MetricCard = ({ title, value, color, icon }) => (
  <div style={{
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  }}>
    <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
    <div style={{ fontSize: '36px', fontWeight: '700', color, marginBottom: '8px' }}>
      {typeof value === 'number' && value > 999 ? value.toLocaleString() : value}
    </div>
    <div style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500', textTransform: 'uppercase' }}>
      {title}
    </div>
  </div>
);
```

### Span Details Panel Template
```javascript
const SpanDetailsPanel = ({ selectedSpan, onClose }) => (
  <div style={{ flex: '1', minWidth: '350px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'auto' }}>
    {/* Header with close button */}
    <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', backgroundColor: 'white', borderRadius: '8px 8px 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Span Details</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>
    </div>

    {/* Content sections */}
    <div style={{ padding: '20px' }}>
      {/* Basic Information */}
      {/* Timing Information */}
      {/* LLM Information (if applicable) */}
      {/* Tool Information (if applicable) */}
      {/* Error Information (if failed) */}
      {/* Attributes */}
      {/* Hierarchy Information */}
    </div>
  </div>
);
```

## Key Reminders

1. **Always use realistic data**: Generate complex session hierarchies with proper error propagation
2. **Professional styling only**: White backgrounds, dark text, Open Sans font, no gradients
3. **Interactive elements**: Hover effects, clickable rows, smooth transitions
4. **OpenTelemetry standards**: Use proper semantic conventions for AI systems
5. **Comprehensive details**: Include all relevant information in span inspection panels
6. **Color coding**: Use consistent colors for operation types and status indicators
7. **Responsive design**: Ensure layouts work on different screen sizes
8. **Error handling**: Implement realistic failure patterns and error types

This ensures consistent, professional, and functional agentic telemetry dashboards that provide real value for debugging and monitoring AI systems.