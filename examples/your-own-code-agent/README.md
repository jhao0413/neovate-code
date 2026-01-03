# Your Own Code Agent

This example demonstrates how to build a custom code agent using the Neovate SDK.

## Quick Start

```bash
cd examples/your-own-code-agent
npx tsx index.ts
```

## Features

### Custom Plugin (`index.ts`)

- **Context Extension**: Add custom context variables (e.g., user identity)
- **Slash Commands**: Register custom slash commands like `/foo`
- **Custom Provider**: Configure your own AI provider with model mapping

### Telemetry Plugin (`my-telemetry.ts`)

- Track file paths accessed during tool calls
- Detect programming languages from file extensions
- Send conversation metrics to a remote server

## Plugin Hooks

| Hook | Description |
|------|-------------|
| `context()` | Add custom context to system prompt |
| `slashCommand()` | Register slash commands |
| `config()` | Override default configuration |
| `provider()` | Add custom AI providers |
| `toolResult()` | Intercept tool results |
| `conversation()` | Hook into conversation lifecycle |

## Example: Custom Provider

```typescript
const myPlugin: Plugin = {
  provider(memo, opts) {
    return {
      myProvider: {
        id: 'myProvider',
        name: 'My Provider',
        models: { 'my-model': opts.models['claude-opus-4-5'] },
        createModel(name) {
          return opts.createAnthropic({
            apiKey: 'your-api-key',
            baseURL: 'https://your-api-endpoint',
          }).chat(name);
        },
      },
      ...memo,
    };
  },
};
```

## Example: Custom Slash Command

```typescript
const plugin: Plugin = {
  slashCommand() {
    return [{
      type: 'prompt',
      name: 'foo',
      description: 'My custom command',
      getPromptForCommand: async () => [{
        role: 'user',
        content: 'Your prompt here',
      }],
    }];
  },
};
```
