import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { trace, Span, SpanKind } from "@opentelemetry/api";

// AI-specific semantic conventions for agentic systems
export const AI_SEMANTIC_CONVENTIONS = {
  // Agent attributes
  AGENT_ID: "ai.agent.id",
  AGENT_TYPE: "ai.agent.type",
  AGENT_STATE: "ai.agent.state",
  AGENT_VERSION: "ai.agent.version",

  // Session attributes
  SESSION_ID: "ai.session.id",
  SESSION_TYPE: "ai.session.type",
  SESSION_USER: "ai.session.user",

  // Task attributes
  TASK_ID: "ai.task.id",
  TASK_TYPE: "task.type",
  TASK_DESCRIPTION: "task.description",
  TASK_PRIORITY: "task.priority",

  // LLM attributes
  LLM_MODEL: "ai.llm.model",
  LLM_PROVIDER: "ai.llm.provider",
  LLM_REQUEST_TYPE: "llm.request.type",
  LLM_TEMPERATURE: "llm.temperature",
  LLM_MAX_TOKENS: "llm.max_tokens",

  // Token metrics
  TOKEN_COUNT_INPUT: "ai.token.count.input",
  TOKEN_COUNT_OUTPUT: "ai.token.count.output",
  TOKEN_COUNT_TOTAL: "ai.token.count.total",

  // Tool attributes
  TOOL_NAME: "ai.tool.name",
  TOOL_VERSION: "ai.tool.version",
  TOOL_OPERATION: "tool.operation",
  TOOL_INPUT_SIZE: "tool.input_size",
  TOOL_OUTPUT_SIZE: "tool.output_size",

  // Workflow attributes
  WORKFLOW_ID: "ai.workflow.id",
  WORKFLOW_TYPE: "ai.workflow.type",
  WORKFLOW_STEP: "ai.workflow.step",

  // Error attributes
  ERROR_TYPE: "ai.error.type",
  ERROR_MESSAGE: "error.message",
  ERROR_STACK: "error.stack",
} as const;

// Type definitions
type AttributeValue = string | number | boolean;

interface AgentSpanOptions {
  agentId: string;
  agentType:
    | "research"
    | "code"
    | "planning"
    | "communication"
    | "data"
    | "monitoring";
  sessionId?: string;
  taskId?: string;
  attributes?: Record<string, AttributeValue>;
}

interface LLMSpanOptions {
  model: string;
  provider: string;
  requestType: "completion" | "embedding" | "function_call";
  temperature?: number;
  maxTokens?: number;
  sessionId?: string;
  attributes?: Record<string, AttributeValue>;
}

interface ToolSpanOptions {
  toolName: string;
  toolVersion?: string;
  operation: string;
  inputSize?: number;
  outputSize?: number;
  sessionId?: string;
  attributes?: Record<string, AttributeValue>;
}

// Initialize OpenTelemetry for browser
class OpenTelemetryManager {
  private readonly provider: WebTracerProvider;
  private readonly tracer: ReturnType<typeof trace.getTracer>;

  constructor() {
    // Configure the tracer provider with minimal resource setup to avoid version conflicts
    this.provider = new WebTracerProvider();

    // Register the provider globally
    this.provider.register();

    // Get tracer instance
    this.tracer = trace.getTracer("opentel-dashboard-tracer", "1.0.0");

    console.log("OpenTelemetry initialized for browser environment");
  }

  // Create an agent span with proper attributes
  createAgentSpan(operationName: string, options: AgentSpanOptions): Span {
    const span = this.tracer.startSpan(operationName, {
      kind: SpanKind.INTERNAL,
      attributes: {
        [AI_SEMANTIC_CONVENTIONS.AGENT_ID]: options.agentId,
        [AI_SEMANTIC_CONVENTIONS.AGENT_TYPE]: options.agentType,
        ...(options.sessionId && {
          [AI_SEMANTIC_CONVENTIONS.SESSION_ID]: options.sessionId,
        }),
        ...(options.taskId && {
          [AI_SEMANTIC_CONVENTIONS.TASK_ID]: options.taskId,
        }),
        ...options.attributes,
      },
    });

    return span;
  }

  // Create an LLM span with token tracking
  createLLMSpan(operationName: string, options: LLMSpanOptions): Span {
    const span = this.tracer.startSpan(operationName, {
      kind: SpanKind.CLIENT,
      attributes: {
        [AI_SEMANTIC_CONVENTIONS.LLM_MODEL]: options.model,
        [AI_SEMANTIC_CONVENTIONS.LLM_PROVIDER]: options.provider,
        [AI_SEMANTIC_CONVENTIONS.LLM_REQUEST_TYPE]: options.requestType,
        ...(options.temperature && {
          [AI_SEMANTIC_CONVENTIONS.LLM_TEMPERATURE]: options.temperature,
        }),
        ...(options.maxTokens && {
          [AI_SEMANTIC_CONVENTIONS.LLM_MAX_TOKENS]: options.maxTokens,
        }),
        ...(options.sessionId && {
          [AI_SEMANTIC_CONVENTIONS.SESSION_ID]: options.sessionId,
        }),
        ...options.attributes,
      },
    });

    return span;
  }

  // Create a tool usage span
  createToolSpan(operationName: string, options: ToolSpanOptions): Span {
    const span = this.tracer.startSpan(operationName, {
      kind: SpanKind.CLIENT,
      attributes: {
        [AI_SEMANTIC_CONVENTIONS.TOOL_NAME]: options.toolName,
        [AI_SEMANTIC_CONVENTIONS.TOOL_OPERATION]: options.operation,
        ...(options.toolVersion && {
          [AI_SEMANTIC_CONVENTIONS.TOOL_VERSION]: options.toolVersion,
        }),
        ...(options.inputSize && {
          [AI_SEMANTIC_CONVENTIONS.TOOL_INPUT_SIZE]: options.inputSize,
        }),
        ...(options.outputSize && {
          [AI_SEMANTIC_CONVENTIONS.TOOL_OUTPUT_SIZE]: options.outputSize,
        }),
        ...(options.sessionId && {
          [AI_SEMANTIC_CONVENTIONS.SESSION_ID]: options.sessionId,
        }),
        ...options.attributes,
      },
    });

    return span;
  }

  // Add token count to an LLM span
  recordTokenUsage(
    span: Span,
    inputTokens: number,
    outputTokens: number
  ): void {
    span.setAttributes({
      [AI_SEMANTIC_CONVENTIONS.TOKEN_COUNT_INPUT]: inputTokens,
      [AI_SEMANTIC_CONVENTIONS.TOKEN_COUNT_OUTPUT]: outputTokens,
      [AI_SEMANTIC_CONVENTIONS.TOKEN_COUNT_TOTAL]: inputTokens + outputTokens,
    });
  }

  // Record an error on a span
  recordError(span: Span, error: Error, errorType?: string): void {
    span.recordException(error);
    span.setAttributes({
      [AI_SEMANTIC_CONVENTIONS.ERROR_TYPE]: errorType || error.name,
      [AI_SEMANTIC_CONVENTIONS.ERROR_MESSAGE]: error.message,
      ...(error.stack && {
        [AI_SEMANTIC_CONVENTIONS.ERROR_STACK]: error.stack,
      }),
    });
  }

  // Get the current tracer instance
  getTracer(): ReturnType<typeof trace.getTracer> {
    return this.tracer;
  }

  // Get the provider instance
  getProvider(): WebTracerProvider {
    return this.provider;
  }
}

// Create singleton instance
const otelManager = new OpenTelemetryManager();

export default otelManager;
export { OpenTelemetryManager };
export type { AgentSpanOptions, LLMSpanOptions, ToolSpanOptions };
