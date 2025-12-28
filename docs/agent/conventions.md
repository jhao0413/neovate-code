# Conventions

This document describes coding conventions, naming patterns, and organizational rules specific to Neovate Code.

## Import Organization

### Standard Import Order
1. Node.js built-in modules
2. External dependencies
3. Internal modules (relative imports)
4. Type imports

### Example
```typescript
import { join } from 'node:path';
import { z } from 'zod';
import { Tool } from '../tool';
import type { ToolContext } from '../types';
```

## Naming Conventions

### File Naming
- **Tools**: `toolName.ts` (e.g., `bash.ts`, `edit.ts`)
- **Tool classes**: `ToolNameTool` (e.g., `BashTool`, `EditTool`)
- **Components**: `ComponentName.tsx` (e.g., `Messages.tsx`, `StatusLine.tsx`)
- **Utilities**: `utilityName.ts` (e.g., `git.ts`, `markdown.ts`)
- **Types**: `types.ts` or `filename.types.ts` (e.g., `nodeBridge.types.ts`)

### Variable Naming
- **Constants**: `UPPER_SNAKE_CASE` for global constants
- **Functions**: `camelCase` for regular functions
- **Classes**: `PascalCase`
- **Private members**: `_leadingUnderscore` for private class members
- **Type parameters**: `T`, `U`, `V` or descriptive names like `TConfig`

## Code Style

### TypeScript Patterns
- Use `interface` for object shapes that can be extended
- Use `type` for unions, intersections, and complex types
- Prefer `readonly` for immutable properties
- Use `as const` for literal type assertions

### Error Handling
- Use `try/catch` for synchronous errors
- Use `.catch()` for promise chains
- Create custom error classes in `src/utils/error.ts`
- Include context in error messages

### Async/Await Patterns
- Always use `try/catch` with async/await
- Avoid mixing promise chains and async/await
- Use `Promise.all()` for parallel operations

## File Organization

### Directory Structure Rules
- `src/tools/` - All agent tools
- `src/ui/` - React components for terminal UI
- `src/utils/` - Utility functions
- `src/slash-commands/` - Built-in slash commands
- `src/commands/` - CLI command implementations

### Component Organization
- Keep components focused and single-responsibility
- Co-locate component styles with components
- Use hooks for state management and side effects
- Separate presentational and container components

## Tool Development Conventions

### Tool Class Structure
```typescript
export class ToolNameTool implements Tool {
  name = 'tool_name';
  description = 'Tool description';
  
  parameters = z.object({
    // Parameter schema using zod
  });
  
  async execute(args, context) {
    // Tool implementation
  }
}
```

### Tool Registration
- Tools are auto-discovered from `src/tools/` directory
- Each tool exports a default class implementing `Tool` interface
- Tools are registered in the tool registry at runtime

## Configuration Conventions

### Configuration Files
- `.neovate.json` - Project-specific configuration
- `~/.neovate/config.json` - User configuration
- Environment variables for sensitive data (API keys)

### Configuration Schema
- Use zod for configuration validation
- Provide sensible defaults
- Support configuration merging (user > project > default)

## Documentation Conventions

### Code Comments
- Use JSDoc for public APIs
- Explain "why" not "what" in comments
- Keep comments up-to-date with code changes

### Documentation Files
- `AGENTS.md` - High-level guidance for AI agents
- `docs/agent/` - Detailed progressive disclosure docs
- `docs/designs/` - Design decisions and RFCs

## Git Conventions

### Commit Messages
Follow conventional commits format:
- `feat:` New features
- `fix:` Bug fixes
- `refactor:` Code refactoring
- `docs:` Documentation changes
- `test:` Test additions/modifications

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
