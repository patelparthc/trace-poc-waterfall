// Core OpenTelemetry Types for Agentic AI Systems

export interface SpanAttributes {
  "ai.agent.id"?: string;
  "ai.agent.type"?: string;
  "ai.agent.state"?: string;
  "ai.session.id"?: string;
  "ai.session.type"?: string;
  "ai.task.id"?: string;
  "task.type"?: string;
  "task.description"?: string;
  "ai.llm.model"?: string;
  "ai.token.count.input"?: number;
  "ai.token.count.output"?: number;
  "ai.tool.name"?: string;
  "tool.input_size"?: number;
  "tool.output_size"?: number;
  "tool.operation"?: string;
  "llm.request.type"?: string;
  "llm.temperature"?: number;
  "error.type"?: string;
  "error.message"?: string;
  "session.num_tasks"?: number;
  "session.num_agents"?: number;
  "session.total_tokens"?: number;
  "user.id"?: string;
  // Allow any additional attributes
  [key: string]: any;
}

// Span interface with comprehensive telemetry data
export interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string | null;
  operationName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  success: boolean;
  attributes: SpanAttributes;

  // AI-specific fields
  agentId?: string;
  agentType?: string;
  taskType?: string;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  toolName?: string;

  // Additional context
  tags?: Record<string, string>;
  logs?: Array<{
    timestamp: Date;
    fields: Record<string, any>;
  }>;
}

// Session represents a user interaction session
export interface Session {
  sessionId: string;
  userId: string;
  sessionType: "interactive" | "batch" | "automated" | "collaborative";
  startTime: Date;
  endTime: Date;
  duration: number;
  numTasks: number;
  numAgents: number;
  success: boolean;
  totalTokens: number;
  traceId: string;
}

// Agent type configuration
export interface AgentType {
  type: string;
  avgTaskDuration: number;
  toolUsage: string[];
}

// LLM model configuration
export interface LLMModel {
  name: string;
  avgInputTokens: number;
  avgOutputTokens: number;
}

// Dashboard data structure
export interface DashboardData {
  sessions: Session[];
  spans: Span[];
  summary: {
    totalSessions: number;
    totalSpans: number;
    timeRange: {
      start: number;
      end: number;
    };
    agentTypes: string[];
    successRate: number;
  };
}

// Table component types
export interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

// Badge component types
export type BadgeVariant = "success" | "error" | "warning" | "info" | "default";

export interface BadgeProps {
  readonly children: React.ReactNode;
  readonly variant?: BadgeVariant;
  readonly size?: "small" | "medium" | "large";
  readonly className?: string;
}

// Metric card types
export interface MetricCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly change?: {
    value: number;
    trend: "up" | "down";
    isPositive?: boolean;
  };
  readonly description?: string;
  readonly icon?: React.ReactNode;
  readonly color?: string;
  readonly onClick?: () => void;
  readonly className?: string;
  readonly isAuroraEnabled?: boolean;
}

// Tab types for dashboard
export type TabType =
  | "overview"
  | "sessions"
  | "spans"
  | "traces"
  | "waterfall";

export interface TabProps {
  readonly data: DashboardData;
  readonly selectedSpan?: Span | null;
  readonly onSpanSelect?: (span: Span) => void;
}

// Waterfall visualization types
export interface WaterfallItem {
  span: Span;
  level: number;
  startPercent: number;
  widthPercent: number;
  children: WaterfallItem[];
}

// Filter and search types
export interface FilterState {
  agentType?: string;
  success?: boolean;
  timeRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

// Chart data types
export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface TimeSeriesData {
  series: {
    name: string;
    data: ChartDataPoint[];
    color?: string;
  }[];
  timeRange: {
    start: number;
    end: number;
  };
}
