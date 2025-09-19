import { v4 as uuidv4 } from "uuid";
import type {
  Session,
  Span,
  AgentType,
  LLMModel,
  DashboardData,
} from "../types";

const agentTypes: AgentType[] = [
  {
    type: "research-agent",
    avgTaskDuration: 5000,
    toolUsage: ["web-search", "document-analyzer", "knowledge-base"],
  },
  {
    type: "code-agent",
    avgTaskDuration: 8000,
    toolUsage: ["code-editor", "compiler", "debugger", "git"],
  },
  {
    type: "planning-agent",
    avgTaskDuration: 4000,
    toolUsage: ["task-planner", "priority-analyzer", "resource-allocator"],
  },
  {
    type: "communication-agent",
    avgTaskDuration: 3000,
    toolUsage: ["email-client", "slack-api", "notification-service"],
  },
  {
    type: "data-agent",
    avgTaskDuration: 6000,
    toolUsage: ["database", "data-processor", "visualization-tool"],
  },
  {
    type: "monitoring-agent",
    avgTaskDuration: 2000,
    toolUsage: ["metrics-collector", "alert-manager", "log-analyzer"],
  },
];

const llmModels: LLMModel[] = [
  { name: "gpt-4", avgInputTokens: 1200, avgOutputTokens: 400 },
  { name: "gpt-3.5-turbo", avgInputTokens: 800, avgOutputTokens: 300 },
  { name: "claude-3", avgInputTokens: 1500, avgOutputTokens: 500 },
  { name: "gemini-pro", avgInputTokens: 1000, avgOutputTokens: 350 },
];

const sessionTypes: (
  | "interactive"
  | "batch"
  | "automated"
  | "collaborative"
)[] = ["interactive", "batch", "automated", "collaborative"];
const taskTypes: (
  | "analysis"
  | "generation"
  | "processing"
  | "communication"
  | "planning"
)[] = ["analysis", "generation", "processing", "communication", "planning"];
const llmRequestTypes: ("completion" | "chat" | "embedding")[] = [
  "completion",
  "chat",
  "embedding",
];
const toolOperations: ("read" | "write" | "process" | "query")[] = [
  "read",
  "write",
  "process",
  "query",
];

const errorTypes = {
  llm: ["rate_limit", "context_length", "safety_filter", "timeout"],
  tool: ["api_error", "timeout", "invalid_input", "rate_limit"],
  task: ["timeout", "resource_limit", "validation_error", "dependency_failure"],
  workflow: [
    "workflow_error",
    "dependency_failure",
    "timeout",
    "resource_exhaustion",
  ],
};

const errorMessages: Record<string, string> = {
  rate_limit: "API rate limit exceeded, retry after 60 seconds",
  context_length: "Input text exceeds maximum context length of 4096 tokens",
  safety_filter: "Content filtered due to safety policy violation",
  timeout: "Operation timed out after 30 seconds",
  api_error: "External API returned 500 Internal Server Error",
  invalid_input: "Input validation failed: missing required parameters",
  resource_limit: "Insufficient resources to complete operation",
  validation_error: "Data validation failed: invalid format",
  dependency_failure: "Dependent service is unavailable",
  workflow_error: "Workflow execution failed at step 3",
  resource_exhaustion: "System resources exhausted, operation cancelled",
};

const taskDescriptions: Record<string, string[]> = {
  "research-agent": [
    "Analyze market trends for Q4 planning",
    "Research competitor pricing strategies",
    "Gather customer feedback data",
    "Investigate new technology adoption",
  ],
  "code-agent": [
    "Implement user authentication system",
    "Optimize database query performance",
    "Fix memory leak in data processing",
    "Add unit tests for API endpoints",
  ],
  "planning-agent": [
    "Create project milestone schedule",
    "Allocate resources for sprint planning",
    "Prioritize feature backlog items",
    "Develop risk mitigation strategies",
  ],
  "communication-agent": [
    "Send project status update emails",
    "Schedule stakeholder meetings",
    "Post team announcements",
    "Coordinate with external partners",
  ],
  "data-agent": [
    "Process customer analytics data",
    "Generate monthly performance reports",
    "Clean and validate dataset",
    "Create data visualization dashboards",
  ],
  "monitoring-agent": [
    "Check system health metrics",
    "Monitor application performance",
    "Analyze error rate trends",
    "Generate alerts for anomalies",
  ],
};

// Utility functions
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)] as T;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Session generation
function generateSession(): Session {
  const sessionComplexity = Math.random();
  const { sessionDuration, numTasks, successRate } =
    getSessionParams(sessionComplexity);

  const sessionId = uuidv4();
  const startTime = new Date(
    Date.now() - randomInt(0, 7 * 24 * 60 * 60 * 1000)
  );
  const endTime = new Date(startTime.getTime() + sessionDuration);
  const sessionSuccess = Math.random() < successRate;

  return {
    sessionId,
    userId: `user-${randomInt(1, 50).toString().padStart(3, "0")}`,
    sessionType: randomChoice(sessionTypes),
    startTime,
    endTime,
    duration: sessionDuration,
    numTasks,
    numAgents: randomInt(2, 6),
    success: sessionSuccess,
    totalTokens: randomInt(5000, 50000),
    traceId: sessionId,
  };
}

function getSessionParams(complexity: number): {
  sessionDuration: number;
  numTasks: number;
  successRate: number;
} {
  if (complexity > 0.7) {
    return {
      sessionDuration: randomInt(600000, 1800000), // 10-30 minutes
      numTasks: randomInt(15, 40),
      successRate: 0.75,
    };
  } else if (complexity > 0.3) {
    return {
      sessionDuration: randomInt(120000, 600000), // 2-10 minutes
      numTasks: randomInt(8, 20),
      successRate: 0.85,
    };
  } else {
    return {
      sessionDuration: randomInt(30000, 120000), // 30s-2 minutes
      numTasks: randomInt(2, 8),
      successRate: 0.95,
    };
  }
}

// Span generation
function generateSpansForSession(session: Session): Span[] {
  const spans: Span[] = [];
  const sessionSpanId = uuidv4();

  // Create root session span
  const sessionSpan = createSessionSpan(session, sessionSpanId);
  spans.push(sessionSpan);

  // Generate task spans
  let currentTime = session.startTime.getTime();
  const remainingTime = session.duration;
  const avgTaskDuration = remainingTime / session.numTasks;

  for (let i = 0; i < session.numTasks; i++) {
    const taskSpans = generateTaskSpan(
      session,
      sessionSpanId,
      i,
      currentTime,
      avgTaskDuration
    );
    spans.push(...taskSpans);
    currentTime += (taskSpans[0]?.duration || 0) + randomInt(100, 1000);
  }

  return spans;
}

function createSessionSpan(session: Session, sessionSpanId: string): Span {
  return {
    traceId: session.traceId,
    spanId: sessionSpanId,
    parentSpanId: null,
    operationName: "session",
    startTime: session.startTime,
    endTime: session.endTime,
    duration: session.duration,
    success: session.success,
    attributes: {
      "ai.session.id": session.sessionId,
      "ai.session.type": session.sessionType,
      "user.id": session.userId,
      "session.num_tasks": session.numTasks,
      "session.num_agents": session.numAgents,
      "session.total_tokens": session.totalTokens,
    },
  };
}

function generateTaskSpan(
  session: Session,
  sessionSpanId: string,
  taskIndex: number,
  currentTime: number,
  avgTaskDuration: number
): Span[] {
  const spans: Span[] = [];
  const agentType = randomChoice(agentTypes);
  const taskDuration = randomInt(avgTaskDuration * 0.5, avgTaskDuration * 1.5);
  const taskStartTime = new Date(currentTime);
  const taskEndTime = new Date(currentTime + taskDuration);

  // Task success logic
  const taskSuccess =
    session.success &&
    !(taskIndex > session.numTasks * 0.6 && Math.random() > 0.7) &&
    Math.random() > 0.1;

  const taskSpanId = uuidv4();
  const taskSpan = createTaskSpan({
    session,
    taskSpanId,
    sessionSpanId,
    agentType,
    taskStartTime,
    taskEndTime,
    taskDuration,
    taskSuccess,
    taskIndex,
  });
  spans.push(taskSpan);

  // Generate LLM spans
  if (Math.random() > 0.3) {
    const llmSpans = generateLLMSpans(
      session,
      taskSpanId,
      taskStartTime,
      taskDuration,
      taskSuccess,
      taskIndex
    );
    spans.push(...llmSpans);
  }

  // Generate tool spans
  if (Math.random() > 0.4) {
    const toolSpans = generateToolSpans(
      session,
      taskSpanId,
      agentType,
      taskStartTime,
      taskDuration,
      taskSuccess,
      taskIndex
    );
    spans.push(...toolSpans);
  }

  return spans;
}

interface TaskSpanParams {
  session: Session;
  taskSpanId: string;
  sessionSpanId: string;
  agentType: AgentType;
  taskStartTime: Date;
  taskEndTime: Date;
  taskDuration: number;
  taskSuccess: boolean;
  taskIndex: number;
}

function createTaskSpan(params: TaskSpanParams): Span {
  const {
    session,
    taskSpanId,
    sessionSpanId,
    agentType,
    taskStartTime,
    taskEndTime,
    taskDuration,
    taskSuccess,
    taskIndex,
  } = params;
  const attributes: Record<string, any> = {
    "ai.agent.id": `${agentType.type}-${randomInt(1, 5)}`,
    "ai.agent.type": agentType.type,
    "ai.session.id": session.sessionId,
    "ai.task.id": `task-${taskIndex + 1}`,
    "task.type": randomChoice(taskTypes),
    "task.description": getTaskDescription(agentType.type),
    "ai.agent.state": taskSuccess ? "completed" : "failed",
  };

  if (!taskSuccess) {
    const errorType = randomChoice(errorTypes.task);
    attributes["error.type"] = errorType;
    attributes["error.message"] =
      errorMessages[errorType] || "Unknown error occurred";
  }

  return {
    traceId: session.traceId,
    spanId: taskSpanId,
    parentSpanId: sessionSpanId,
    operationName: `agent-task:${agentType.type}`,
    startTime: taskStartTime,
    endTime: taskEndTime,
    duration: taskDuration,
    success: taskSuccess,
    agentId: `${agentType.type}-${randomInt(1, 5)}`,
    agentType: agentType.type,
    taskType: randomChoice(taskTypes),
    attributes,
  };
}

function generateLLMSpans(
  session: Session,
  taskSpanId: string,
  taskStartTime: Date,
  taskDuration: number,
  taskSuccess: boolean,
  taskIndex: number
): Span[] {
  const spans: Span[] = [];
  const numLLMCalls = randomInt(1, 3);
  let llmStartTime = taskStartTime.getTime() + randomInt(0, taskDuration * 0.2);

  for (let j = 0; j < numLLMCalls; j++) {
    const llmModel = randomChoice(llmModels);
    const llmDuration = randomInt(800, 3000);
    const llmSpanStartTime = new Date(llmStartTime);
    const llmSpanEndTime = new Date(llmStartTime + llmDuration);

    const llmSuccess = taskSuccess && Math.random() > 0.05;
    const inputTokens = randomInt(
      llmModel.avgInputTokens * 0.5,
      llmModel.avgInputTokens * 1.5
    );
    const outputTokens = llmSuccess
      ? randomInt(
          llmModel.avgOutputTokens * 0.5,
          llmModel.avgOutputTokens * 1.5
        )
      : 0;

    const attributes: Record<string, any> = {
      "ai.llm.model": llmModel.name,
      "ai.token.count.input": inputTokens,
      "ai.token.count.output": outputTokens,
      "ai.session.id": session.sessionId,
      "ai.task.id": `task-${taskIndex + 1}`,
      "llm.request.type": randomChoice(llmRequestTypes),
      "llm.temperature": randomFloat(0.1, 0.9),
    };

    if (!llmSuccess) {
      const errorType = randomChoice(errorTypes.llm);
      attributes["error.type"] = errorType;
      attributes["error.message"] =
        errorMessages[errorType] || "Unknown error occurred";
    }

    const llmSpan: Span = {
      traceId: session.traceId,
      spanId: uuidv4(),
      parentSpanId: taskSpanId,
      operationName: `llm:${llmModel.name}`,
      startTime: llmSpanStartTime,
      endTime: llmSpanEndTime,
      duration: llmDuration,
      success: llmSuccess,
      model: llmModel.name,
      inputTokens,
      outputTokens,
      attributes,
    };

    spans.push(llmSpan);
    llmStartTime += llmDuration + randomInt(100, 500);
  }

  return spans;
}

function generateToolSpans(
  session: Session,
  taskSpanId: string,
  agentType: AgentType,
  taskStartTime: Date,
  taskDuration: number,
  taskSuccess: boolean,
  taskIndex: number
): Span[] {
  const spans: Span[] = [];
  const numToolCalls = randomInt(1, 3);
  let toolStartTime =
    taskStartTime.getTime() + randomInt(taskDuration * 0.1, taskDuration * 0.8);

  for (let k = 0; k < numToolCalls; k++) {
    const toolName = randomChoice(agentType.toolUsage);
    const toolDuration = randomInt(200, 2000);
    const toolSpanStartTime = new Date(toolStartTime);
    const toolSpanEndTime = new Date(toolStartTime + toolDuration);

    const toolSuccess = taskSuccess && Math.random() > 0.08;
    const inputSize = randomInt(100, 5000);
    const outputSize = toolSuccess ? randomInt(50, 3000) : 0;

    const attributes: Record<string, any> = {
      "ai.tool.name": toolName,
      "tool.input_size": inputSize,
      "tool.output_size": outputSize,
      "ai.session.id": session.sessionId,
      "ai.task.id": `task-${taskIndex + 1}`,
      "tool.operation": randomChoice(toolOperations),
    };

    if (!toolSuccess) {
      const errorType = randomChoice(errorTypes.tool);
      attributes["error.type"] = errorType;
      attributes["error.message"] =
        errorMessages[errorType] || "Unknown error occurred";
    }

    const toolSpan: Span = {
      traceId: session.traceId,
      spanId: uuidv4(),
      parentSpanId: taskSpanId,
      operationName: `tool:${toolName}`,
      startTime: toolSpanStartTime,
      endTime: toolSpanEndTime,
      duration: toolDuration,
      success: toolSuccess,
      toolName,
      attributes,
    };

    spans.push(toolSpan);
    toolStartTime += toolDuration + randomInt(50, 200);
  }

  return spans;
}

function getTaskDescription(agentType: string): string {
  const descriptions = taskDescriptions[agentType];
  return descriptions ? randomChoice(descriptions) : "Perform agent task";
}

// Main generation function
export function generateSampleTraceData(
  numSessions: number = 150
): DashboardData {
  console.log(
    `Generating ${numSessions} sessions with comprehensive trace data...`
  );

  const sessions: Session[] = [];
  const allSpans: Span[] = [];

  // Generate sessions and their spans
  for (let i = 0; i < numSessions; i++) {
    const session = generateSession();
    sessions.push(session);

    const spans = generateSpansForSession(session);
    allSpans.push(...spans);

    if (i % 10 === 0) {
      console.log(`Generated ${i + 1}/${numSessions} sessions...`);
    }
  }

  console.log(
    `Generated ${sessions.length} sessions with ${allSpans.length} total spans`
  );

  return {
    sessions,
    spans: allSpans,
    summary: {
      totalSessions: sessions.length,
      totalSpans: allSpans.length,
      timeRange: {
        start: Math.min(...sessions.map((s) => s.startTime.getTime())),
        end: Math.max(...sessions.map((s) => s.endTime.getTime())),
      },
      agentTypes: agentTypes.map((at) => at.type),
      successRate: sessions.filter((s) => s.success).length / sessions.length,
    },
  };
}

// Export constants for external use
export { agentTypes, llmModels };
