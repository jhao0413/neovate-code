# Architecture

This document describes the architectural patterns and module structure of Neovate Code.

## Core Structure

The codebase follows a modular architecture with clear separation of concerns:

```
src/
├── cli.ts              # Entry point, initializes product with configuration
├── index.ts            # Core app logic: argument parsing, session management, UI rendering
├── context.ts          # Dependency injection and central context management
├── plugin.ts           # Extensible plugin architecture for custom functionality
├── tools/              # Agent tools: bash, edit, read, write, grep, glob, fetch, todo
├── ui/                 # React-based terminal UI components (Ink framework)
├── mcp.ts              # Model Context Protocol integration for external AI services
├── slash-commands/     # Built-in commands accessible via slash notation
├── session.ts          # Session persistence and resumption
├── messageBus.ts       # Event-driven communication between components
└── server/             # HTTP server mode for browser-based UI
```

## Key Concepts

### Tool System

Tools are resolved dynamically based on context and permissions:

- **Read-only tools**: `read`, `ls`, `glob`, `grep`, `fetch`
- **Write tools**: `write`, `edit`, `bash` (conditionally enabled)
- **Todo tools**: `todo read/write` (session-specific storage)

Tools follow a consistent pattern with `Tool` suffix classes and use `zod` for runtime validation.

### Plugin Architecture

Extensible system for adding custom functionality without modifying core code. Plugins can:
- Register new tools
- Add slash commands
- Modify system prompts
- Extend configuration options

### Session Management

Sessions persist and can be resumed, storing conversation history and todos in global config directory (`~/.neovate/projects/`).

### Message Bus

Event-driven communication between components using a centralized message bus for loose coupling.

## Essential Coding Patterns

- Use `pathe` instead of `path` for cross-platform compatibility
- Use `zod` for runtime type validation
- Suffix tool classes with 'Tool'
- Prefer async/await for asynchronous operations
- Use dependency injection via context system

## Configuration Management

Configuration follows a layered approach:
1. Default configuration in code
2. User configuration from `~/.neovate/config.json`
3. Project-specific configuration from `.neovate.json`
4. Environment variables
5. Command-line arguments

## Data Flow

1. User input → CLI argument parsing
2. Session initialization/resumption
3. Tool resolution and execution
4. AI model interaction via AI SDK
5. UI rendering with Ink framework
6. Session persistence

## Build Strategy

- Uses Bun for bundling (faster than traditional bundlers)
- Separate builds for CLI and SDK entry points
- TypeScript declaration bundling with API Extractor
- MCP server bundling for external tool integration
