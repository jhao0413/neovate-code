# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Neovate Code is an AI-powered coding agent CLI that enables developers to interact with their codebase using natural language. It provides intelligent code assistance, refactoring, and automation through a conversational interface.

**Key Technologies:**
- TypeScript/Node.js (requires Node.js 18+)
- Package Manager: pnpm (managed via Volta)
- Build Tool: Bun 1.2.7 (required for building)
- UI: Ink (React for terminal interfaces)
- AI Integration: AI SDK with multiple LLM provider support
- Model Context Protocol (MCP) for extensible tool capabilities
- Testing: Vitest
- Code Quality: Biome (formatting + linting)

## Development Commands

### Essential Commands
```bash
# Development
bun ./src/cli.ts          # Run CLI in development mode
pnpm dev                  # Same as above (via pnpm script)

# Building (requires Bun 1.2.7)
pnpm build                # Full production build

# Testing
pnpm test                 # Run all tests (vitest run)
pnpm run test:watch       # Watch mode for test development
pnpm test:e2e             # Run end-to-end tests (requires E2E_MODEL in .env)
pnpm test:e2e --only normal/basic  # Run specific e2e test

# Quality Checks
pnpm run typecheck        # TypeScript type checking
pnpm run format           # Check formatting
pnpm run format -- --write # Format all files
pnpm run ci               # Full CI pipeline (typecheck + format + test)
pnpm ready                # Pre-commit checks (use --e2e to include e2e tests)

# VSCode Extension
pnpm run extension:dev    # Development mode for VSCode extension
pnpm run extension:build  # Build the extension
```

### Running Single Test
```bash
vitest run path/to/test.test.ts
```

### Debugging
- Press `⌘+⇧+D` to open debug view, select "Debug cli"
- Use `DEBUG=neovate*` prefix to print debug logs
- Add `-q` flag for quiet logs
- Check session files in `~/.neovate/projects/` directory

## Architecture

### Core Module Structure

```
src/
├── cli.ts              # Entry point, initializes product with configuration
├── index.ts            # Core app logic: argument parsing, session management, UI rendering
├── context.ts          # Dependency injection and central context management
├── plugin.ts           # Extensible plugin architecture
├── tools/              # Agent tools (bash, edit, read, write, grep, glob, fetch, todo, etc.)
├── ui/                 # React-based terminal UI components (Ink framework)
├── slash-commands/     # Built-in commands accessible via slash notation (e.g., /login, /model, /help)
├── session.ts          # Session persistence and resumption
├── messageBus.ts       # Event-driven communication between components
├── mcp.ts              # Model Context Protocol integration
├── commands/           # CLI command implementations
└── utils/              # Utility functions
```

### Key Architectural Patterns

**Tool System:**
- Tools are auto-discovered from `src/tools/` directory
- Each tool exports a class with `Tool` suffix (e.g., `BashTool`, `EditTool`)
- Tools use zod for runtime validation
- Tool classes implement the `Tool` interface

**Session Management:**
- Sessions persist in `~/.neovate/projects/` directory
- Can be resumed across CLI invocations
- Store conversation history and todos

**Configuration Layering (priority order):**
1. Command-line arguments
2. Environment variables
3. Project-specific config (`.neovate.json`)
4. User config (`~/.neovate/config.json`)
5. Default configuration in code

**Message Bus:**
- Event-driven architecture using centralized message bus
- Loose coupling between components

**Plugin Architecture:**
- Plugins can register new tools, slash commands, modify system prompts
- Extensible without modifying core code

### Data Flow

1. User input → CLI argument parsing
2. Session initialization/resumption
3. Tool resolution and execution
4. AI model interaction via AI SDK
5. UI rendering with Ink framework
6. Session persistence

## Coding Conventions

### Essential Patterns
- **Use `pathe` instead of `path`** for cross-platform compatibility
- Use `zod` for runtime type validation
- Suffix tool classes with `Tool` (e.g., `BashTool`)
- Use async/await for asynchronous operations
- Use dependency injection via context system

### File Naming
- Tools: `toolName.ts` with class `ToolNameTool`
- Components: `ComponentName.tsx`
- Tests: `filename.test.ts` (co-located with source files)

### Import Order
1. Node.js built-in modules
2. External dependencies
3. Internal modules (relative imports)
4. Type imports

### TypeScript
- Use `interface` for object shapes that can be extended
- Use `type` for unions, intersections, and complex types
- Prefer `readonly` for immutable properties

### Commit Messages
Follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code refactoring
- `docs:` Documentation changes
- `test:` Test additions/modifications

## Testing

### Test Structure
- Test files: `src/**/*.test.ts` (co-located with source)
- E2E tests: `e2e/` directory with fixtures
- Framework: Vitest with Node environment
- Timeout: 30 seconds

### E2E Test Setup
1. Set `E2E_MODEL` environment variable in `.env` file
2. Configure appropriate API keys for the chosen model
3. Tests use real LLM providers (costs may apply)

### Test Patterns
- Mock external dependencies (file system, network)
- Use Vitest's built-in mocking capabilities
- Test tools in isolation
- Validate zod schemas

## Build Strategy

- Uses Bun for bundling (faster than traditional bundlers)
- Separate builds for CLI (`dist/cli.mjs`) and SDK (`dist/index.mjs`)
- TypeScript declaration bundling with API Extractor
- MCP server bundling for external tool integration
- `react-devtools-core` is externalized in builds

## Progressive Disclosure

For detailed information, consult these documents:

- `docs/agent/development_commands.md` - Complete command reference
- `docs/agent/architecture.md` - Detailed architectural patterns
- `docs/agent/testing.md` - Test infrastructure and conventions
- `docs/agent/conventions.md` - Coding conventions and naming patterns
- `CONTRIBUTING.md` - Development setup and contribution guidelines

**When working on a task, first determine which documentation is relevant, then read only those files.**
