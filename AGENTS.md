# AGENTS.md

This file provides guidance to neovate when working with code in this repository.

## WHY: Purpose and Goals

Neovate Code is an AI-powered coding agent CLI that transforms development workflow through conversational programming. It enables developers to interact with their codebase using natural language, providing intelligent code assistance, refactoring, and automation.

**Core Value**: Bridge the gap between developer intent and code execution through natural language interaction, making complex codebase operations accessible and efficient.

## WHAT: Technical Stack

- **Runtime**: TypeScript/Node.js (requires Node.js 18+, built with Bun 1.2.7)
- **Package Manager**: pnpm
- **UI Framework**: Ink (React for terminal interfaces)
- **AI Integration**: AI SDK with multiple LLM provider support
- **MCP Support**: Model Context Protocol for extensible tool capabilities
- **Testing**: Vitest
- **Code Quality**: Biome (formatting + linting, config in `biome.json`)

## HOW: Core Development Workflow

```bash
bun ./src/cli.ts          # Run CLI in development mode
npm run build             # Build the project
npm test                  # Run tests
npm run typecheck         # Type checking
npm run format -- --write # Format code
npm run ci                # Full CI pipeline (typecheck + format + test)
```

## Progressive Disclosure

For detailed information, consult these documents as needed:

- `docs/agent/development_commands.md` - All build, test, lint, release commands
- `docs/agent/architecture.md` - Module structure and architectural patterns
- `docs/agent/testing.md` - Test setup, frameworks, and conventions

**When working on a task, first determine which documentation is relevant, then read only those files.**
