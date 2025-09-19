# OpenTelemetry Dashboard - Copilot Instructions

## Project Context

This is a production-ready OpenTelemetry dashboard for agentic AI systems built with React 19 + Vite. The dashboard provides comprehensive observability for multi-agent workflows, LLM interactions, and complex AI system operations.

## Development Guidelines

### Core Technologies

- React 19 with functional components and modern hooks
- Vite for fast development and building
- OpenTelemetry SDK with AI-specific semantic conventions
- Pure CSS-in-JS styling (no external UI libraries)
- Open Sans typography for professional appearance

### Architecture Principles

- Generate 1000+ realistic trace samples with hierarchical structure
- Implement 5 main tabs: Overview, Sessions, Spans, Traces, Waterfall
- Use clean minimalist design with white backgrounds and dark text
- Create interactive components with hover effects and smooth transitions
- Build custom table components without external dependencies

### Data Generation Patterns

- 30% complex sessions (10-30 minutes, 15-40 tasks)
- 40% medium sessions (2-10 minutes, 8-20 tasks)
- 30% simple sessions (30s-2 minutes, 2-8 tasks)
- 6 agent types: research, code, planning, communication, data, monitoring
- Realistic error patterns with cascading failures
- LLM tracking with token counts and model information
- Tool usage spans with input/output sizes

### UI/UX Standards

- Professional color scheme: white (#ffffff), dark text (#1f2937, #4b5563, #6b7280)
- Interactive hover effects with transform and shadow changes
- Color-coded status badges (green for success, red for errors)
- Fullscreen layout with responsive design
- Waterfall visualization similar to Jaeger/Zipkin

### Component Patterns

- MetricCard with hover lift effects and large metric displays
- Custom table rows with clickable navigation
- Span details panel with comprehensive telemetry information
- Waterfall timeline with proportional duration bars
- Badge components for status indication

When implementing features, follow the existing patterns and maintain consistency with the professional, enterprise-grade design system.
