# 自定义提供商插件示例

本目录包含两个示例插件，展示如何在 Neovate Code 中添加自定义提供商和模型。

## 🚀 快速安装

### 最快的方式（3 步）：

```bash
# 1. 复制插件到全局插件目录
cp examples/custom-provider/plugin-simple.ts ~/.neovate/plugins/my-provider.ts

# 2. 设置环境变量（替换为你的 API Key）
export MY_CUSTOM_API_KEY='your-api-key-here'

# 3. 重启 Neovate Code 并选择模型
neo
# 输入: /model
# 选择: my-custom-provider/my-model-v1
```

就这么简单！现在你可以在 Neovate Code 中使用自定义提供商了。

---

## 📚 详细安装方式

本插件支持多种安装方式，详见下文的"安装插件"章节。

---

## 文件说明

- `plugin-simple.ts` - 简单的 OpenAI 兼容提供商插件（代码中固定配置）
- `plugin-advanced.ts` - 高级自定义提供商插件，包含自定义模型配置（代码中固定配置）
- `plugin-configurable.ts` - **可配置插件**，支持通过配置文件动态添加提供商（推荐）
- `.neovate.config.example.json` - 可配置插件的配置示例
- `index.ts` - 完整的自定义代码代理示例
- `README.md` - 本文档

## 🎯 推荐使用可配置插件

`plugin-configurable.ts` 是最灵活的插件，允许你通过配置文件动态添加多个提供商，无需修改代码！

## 快速开始

### 1. 简单插件

`plugin-simple.ts` 展示了最基本的提供商集成：

```typescript
import type { Plugin } from '@neovate/code';

const simplePlugin: Plugin = {
  name: 'custom-provider-simple',

  provider(memo, opts) {
    return {
      'my-custom-provider': {
        id: 'my-custom-provider',
        env: ['MY_CUSTOM_API_KEY'],
        name: 'My Custom Provider',
        api: 'https://api.my-custom-provider.com/v1',
        doc: 'https://docs.my-custom-provider.com',
        models: {
          'my-model-v1': opts.models['gpt-4o'],
          'my-model-v2': opts.models['gpt-4.1'],
        },
        createModel(name, provider) {
          const apiKey = provider.options?.apiKey || process.env.MY_CUSTOM_API_KEY;
          const baseURL = provider.options?.baseURL || provider.api;

          return opts
            .createOpenAICompatible({
              name: provider.id,
              baseURL,
              apiKey,
            })
            .chat(name);
        },
      },
      ...memo,
    };
  },
};

export default simplePlugin;
```

### 2. 高级插件

`plugin-advanced.ts` 展示了更完整的功能：

- 自定义模型配置（完全定义模型元数据）
- 多个自定义模型
- 模型别名
- 自定义请求头
- 代理支持

### 3. 可配置插件（推荐）⭐

`plugin-configurable.ts` 是最灵活的插件，允许你通过配置文件动态添加多个提供商，无需修改代码！

**特点**：
- 通过配置文件添加提供商
- 支持多个提供商同时配置
- 支持引用内置模型定义
- 支持完全自定义模型
- 支持模型别名
- 支持自定义请求头
- 支持代理配置

**快速开始**：

```bash
# 1. 复制插件到全局插件目录
cp examples/custom-provider/plugin-configurable.ts ~/.neovate/plugins/custom-provider.ts

# 2. 复制配置示例
cp examples/custom-provider/.neovate.config.example.json ~/.neovate/config.json

# 3. 编辑配置文件，添加你的 API Key
vim ~/.neovate/config.json

# 4. 重启 Neovate Code
neo
```

**配置文件示例**：

```json
{
  "extensions": {
    "customProviders": {
      "my-provider": {
        "name": "My Provider",
        "api": "https://api.my-provider.com/v1",
        "doc": "https://docs.my-provider.com",
        "env": ["MY_PROVIDER_API_KEY"],
        "models": {
          "model-1": "gpt-4o",
          "model-2": "gpt-4.1"
        },
        "aliases": {
          "m1": "model-1",
          "m2": "model-2"
        }
      }
    }
  },
  "provider": {
    "my-provider": {
      "options": {
        "apiKey": "your-api-key-here"
      }
    }
  }
}
```

**配置说明**：

- `extensions.customProviders` - 定义所有自定义提供商
- `provider` - 配置每个提供商的 API Key 和其他选项

详细配置说明见下文"可配置插件详解"章节。

## 核心概念

### Provider 接口

```typescript
interface Provider {
  id: string;           // 提供商唯一标识
  env: string[];        // 环境变量列表（用于 API Key）
  name: string;         // 提供商显示名称
  apiEnv?: string[];    // 自定义 API Base URL 环境变量
  api?: string;         // 默认 API Base URL
  doc: string;          // 文档链接
  models: Record<string, string | Omit<Model, 'id' | 'cost'>>;  // 模型映射
  createModel(          // 模型创建函数
    name: string,
    provider: Provider,
    options: {
      globalConfigDir: string;
      setGlobalConfig: (key: string, value: string, isGlobal: boolean) => void;
    },
  ): Promise<LanguageModelV2> | LanguageModelV2;
  options?: {           // 可选配置
    baseURL?: string;
    apiKey?: string;
    headers?: Record<string, string>;
    httpProxy?: string;
  };
}
```

### Model 接口

```typescript
interface Model {
  id: string;
  name: string;
  shortName?: string;
  attachment: boolean;      // 是否支持附件
  reasoning: boolean;      // 是否支持推理
  temperature: boolean;    // 是否支持温度设置
  tool_call: boolean;      // 是否支持工具调用
  knowledge: string;       // 知识截止日期
  release_date: string;    // 发布日期
  last_updated: string;    // 最后更新日期
  modalities: {            // 支持的模态
    input: ('text' | 'image' | 'audio' | 'video' | 'pdf')[];
    output: ('text' | 'audio' | 'image')[];
  };
  open_weights: boolean;    // 是否开源
  cost: {                  // 成本信息（内部使用）
    input: number;
    output: number;
    cache_read?: number;
    cache_write?: number;
  };
  limit: {                 // 限制
    context: number;       // 上下文窗口大小
    output: number;        // 输出最大长度
  };
}
```

## 常用模式

### 1. OpenAI 兼容提供商

```typescript
createModel(name, provider) {
  return opts
    .createOpenAICompatible({
      name: provider.id,
      baseURL: provider.api,
      apiKey: provider.options?.apiKey || process.env.MY_API_KEY,
    })
    .chat(name);
}
```

### 2. Anthropic 兼容提供商

```typescript
createModel(name, provider) {
  return opts
    .createAnthropic({
      apiKey: provider.options?.apiKey || process.env.MY_API_KEY,
      baseURL: provider.api,
    })
    .chat(name);
}
```

### 3. Google 兼容提供商

```typescript
createModel(name, provider) {
  const google = opts.createGoogleGenerativeAI({
    apiKey: provider.options?.apiKey || process.env.MY_API_KEY,
    baseURL: provider.api,
  });
  return google(name);
}
```

### 4. 使用内置模型定义

```typescript
models: {
  'my-model': opts.models['gpt-4o'],  // 引用内置模型定义
  'my-model-2': opts.models['claude-3-5-sonnet-20241022'],
}
```

### 5. 自定义模型定义

```typescript
models: {
  'my-custom-model': {
    name: 'My Custom Model',
    shortName: 'Custom',
    attachment: true,
    reasoning: true,
    temperature: true,
    tool_call: true,
    knowledge: '2025-01',
    release_date: '2025-01-01',
    last_updated: '2025-01-01',
    modalities: {
      input: ['text', 'image'],
      output: ['text'],
    },
    open_weights: false,
    limit: {
      context: 128000,
      output: 4096,
    },
  },
}
```

### 6. 添加自定义请求头

```typescript
createModel(name, provider) {
  return opts
    .createOpenAICompatible({
      name: provider.id,
      baseURL: provider.api,
      apiKey: provider.options?.apiKey || process.env.MY_API_KEY,
      headers: {
        'X-Custom-Header': 'my-value',
        'User-Agent': 'My-Agent/1.0',
      },
    })
    .chat(name);
}
```

### 7. 配置代理

```typescript
// 在 provider 层面配置
{
  id: 'my-provider',
  // ... 其他配置
  options: {
    httpProxy: process.env.MY_PROXY,
  },
}

// 或使用全局代理（通过配置）
```

### 8. 模型别名

```typescript
modelAlias(memo) {
  return {
    awesome: 'my-provider/my-awesome-model',
    fast: 'my-provider/my-fast-model',
    ...memo,
  };
}
```

## 安装插件

在 Neovate Code 中安装插件有以下几种方式：

### 方式一：全局插件目录（推荐）

将插件文件放在全局插件目录中，所有项目都可以使用。

#### 步骤：

1. **创建插件目录**
   ```bash
   mkdir -p ~/.neovate/plugins
   ```

2. **复制插件文件**
   ```bash
   # 复制简单插件
   cp examples/custom-provider/plugin-simple.ts ~/.neovate/plugins/my-custom-provider.ts

   # 或者复制高级插件
   cp examples/custom-provider/plugin-advanced.ts ~/.neovate/plugins/my-custom-provider.ts
   ```

3. **重启 Neovate Code**
   - 插件会自动加载，无需额外配置

4. **验证插件**
   ```bash
   # 使用 /model 命令查看可用的模型
   neo
   # 输入: /model
   # 应该能看到 my-provider 或 my-custom-provider
   ```

### 方式二：项目级插件目录

将插件放在项目的插件目录中，仅对当前项目生效。

#### 步骤：

1. **在项目根目录创建插件目录**
   ```bash
   mkdir -p .neovate/plugins
   ```

2. **复制插件文件**
   ```bash
   cp examples/custom-provider/plugin-simple.ts .neovate/plugins/my-provider.ts
   ```

3. **在项目中使用**
   ```bash
   cd your-project
   neo
   # 插件会自动加载
   ```

### 方式三：通过配置文件

在配置文件中指定插件路径。

#### 全局配置文件 `~/.neovate/config.json`：

```json
{
  "plugins": [
    "/path/to/plugin-simple.ts",
    "./relative/path/to/plugin.ts"
  ]
}
```

#### 项目配置文件 `.neovate/config.json`：

```json
{
  "plugins": [
    "./.neovate/plugins/my-provider.ts",
    "/home/user/neovate-code/examples/custom-provider/plugin-advanced.ts"
  ]
}
```

### 方式四：npm 包（适用于发布到 npm 的插件）

如果插件发布到了 npm，可以直接在配置文件中引用：

1. **安装插件包**
   ```bash
   npm install -g my-neovate-plugin
   # 或在项目中安装
   npm install --save-dev my-neovate-plugin
   ```

2. **在配置文件中引用**
   ```json
   {
     "plugins": [
       "my-neovate-plugin"
     ]
   }
   ```

## 运行示例

### 作为独立代码代理运行

如果你想创建一个完全自定义的代码代理，可以运行：

```bash
# 设置环境变量
export MY_PROVIDER_API_KEY='your-api-key'
export MY_PROVIDER_API_BASE='https://api.my-provider.com/v1'

# 运行自定义代理
node examples/custom-provider/index.js

# 或使用 tsx
npx tsx examples/custom-provider/index.ts
```

这将创建一个名为 "MyCustomAgent" 的独立命令行工具。

## 插件加载优先级

Neovate Code 按照以下顺序加载插件（后面的会覆盖前面的）：

1. **内置插件** - Neovate Code 自带的插件
2. **全局插件** - `~/.neovate/plugins/` 目录下的插件（按字母顺序）
3. **项目插件** - `.neovate/plugins/` 目录下的插件（按字母顺序）
4. **配置文件中的插件** - `config.json` 中 `plugins` 数组指定的插件
5. **运行时传入的插件** - 通过 `runNeovate()` 函数传入的插件

**注意**：`provider` 钩子使用 `SeriesLast` 类型，意味着后面的插件会覆盖前面同名提供商的配置。

## 配置提供商

可以通过以下方式配置提供商：

### 1. 环境变量

```bash
export MY_PROVIDER_API_KEY='your-api-key'
export MY_PROVIDER_API_BASE='https://api.my-provider.com/v1'
```

### 2. 配置文件

在 `~/.neovate/config.json` 中：

```json
{
  "provider": {
    "my-provider": {
      "options": {
        "apiKey": "your-api-key",
        "baseURL": "https://api.my-provider.com/v1",
        "headers": {
          "X-Custom-Header": "my-value"
        }
      }
    }
  }
}
```

### 3. 项目级配置

在项目根目录的 `.neovate.json` 中：

```json
{
  "provider": {
    "my-provider": {
      "options": {
        "apiKey": "your-api-key"
      }
    }
  }
}
```

## 可配置插件详解

### 安装

```bash
# 1. 复制插件
cp examples/custom-provider/plugin-configurable.ts ~/.neovate/plugins/custom-provider.ts

# 2. 复制配置示例
cp examples/custom-provider/.neovate.config.example.json ~/.neovate/config.json

# 3. 编辑配置
vim ~/.neovate/config.json
```

### 配置结构

配置文件主要包含两部分：

```json
{
  "extensions": {
    "customProviders": {
      // 提供商定义
    }
  },
  "provider": {
    // 提供商 API Key 配置
  }
}
```

### extensions.customProviders

定义所有自定义提供商的详细信息。

```json
{
  "extensions": {
    "customProviders": {
      "my-provider": {
        "name": "My Provider",              // 提供商显示名称
        "api": "https://api.example.com/v1", // API Base URL
        "doc": "https://docs.example.com",   // 文档链接
        "env": ["MY_API_KEY"],               // 环境变量名称
        "apiEnv": ["MY_API_BASE"],          // 自定义 API URL 环境变量
        "headers": {                         // 自定义请求头
          "X-Custom-Header": "value"
        },
        "models": {                          // 模型定义
          "model-1": "gpt-4o",              // 引用内置模型
          "model-2": {                      // 完全自定义模型
            "name": "Custom Model",
            "shortName": "Custom",
            "attachment": true,
            "reasoning": true,
            "temperature": true,
            "tool_call": true,
            "knowledge": "2025-01",
            "release_date": "2025-01-01",
            "last_updated": "2025-01-01",
            "modalities": {
              "input": ["text", "image"],
              "output": ["text"]
            },
            "open_weights": false,
            "limit": {
              "context": 128000,
              "output": 4096
            }
          }
        },
        "aliases": {                         // 模型别名
          "m1": "model-1",
          "m2": "model-2"
        },
        "options": {                         // 默认选项
          "httpProxy": "http://localhost:8080"
        }
      }
    }
  }
}
```

### provider

配置每个提供商的 API Key 和运行时选项。

```json
{
  "provider": {
    "my-provider": {
      "options": {
        "apiKey": "your-api-key-here",    // API Key（会覆盖环境变量）
        "baseURL": "https://api.example.com/v1",  // 自定义 API URL
        "headers": {                       // 额外的请求头
          "X-Extra-Header": "value"
        },
        "httpProxy": "http://proxy.com:8080"  // 代理设置
      }
    }
  }
}
```

### 配置优先级

API Key 的获取优先级（从高到低）：
1. `provider.<providerId>.options.apiKey` - 配置文件中的 API Key
2. 环境变量 - `env` 中指定的环境变量

API URL 的获取优先级（从高到低）：
1. `provider.<providerId>.options.baseURL` - 配置文件中的 URL
2. 环境变量 - `apiEnv` 中指定的环境变量
3. `extensions.customProviders.<providerId>.api` - 提供商定义中的 URL

### 可用的内置模型引用

在 `models` 中，你可以直接引用 Neovate Code 的内置模型：

- `gpt-4.1` - GPT 4.1
- `gpt-4` - GPT 4
- `gpt-4o` - GPT 4o
- `gpt-5` - GPT 5
- `gpt-5-mini` - GPT 5 Mini
- `o3` - o3
- `o3-mini` - o3 Mini
- `o4-mini` - o4 Mini
- `claude-3-5-sonnet-20241022` - Claude 3.5 Sonnet
- `claude-3-7-sonnet` - Claude 3.7 Sonnet
- `claude-4-opus` - Claude 4 Opus
- `claude-4-sonnet` - Claude 4 Sonnet
- `claude-4.1-opus` - Claude 4.1 Opus
- `claude-4-5-sonnet` - Claude 4.5 Sonnet
- `claude-opus-4-5` - Claude Opus 4.5
- `claude-haiku-4-5` - Claude Haiku 4.5
- `gemini-2.5-flash` - Gemini 2.5 Flash
- `gemini-2.5-pro` - Gemini 2.5 Pro
- `gemini-3-pro-preview` - Gemini 3 Pro Preview
- `deepseek-v3.2` - DeepSeek V3.2
- `deepseek-r1-0528` - DeepSeek R1
- 等等...

完整列表请查看 [src/model.ts](https://github.com/neovateai/neovate-code/blob/main/src/model.ts)

### 完整示例

示例配置文件：`.neovate.config.example.json`

```json
{
  "extensions": {
    "customProviders": {
      "openrouter": {
        "name": "OpenRouter",
        "api": "https://openrouter.ai/api/v1",
        "doc": "https://openrouter.ai/docs",
        "env": ["OPENROUTER_API_KEY"],
        "models": {
          "anthropic/claude-3.5-sonnet": "claude-3-5-sonnet-20241022",
          "openai/gpt-4o": "gpt-4o"
        },
        "aliases": {
          "claude": "anthropic/claude-3.5-sonnet",
          "gpt4": "openai/gpt-4o"
        }
      },
      "together": {
        "name": "Together AI",
        "api": "https://api.together.xyz/v1",
        "doc": "https://docs.together.ai",
        "env": ["TOGETHER_API_KEY"],
        "models": {
          "meta-llama/Llama-3-70b-chat-hf": "gpt-4.1",
          "mistralai/Mixtral-8x7B-Instruct-v0.1": "gpt-4o"
        }
      },
      "custom": {
        "name": "My Custom Provider",
        "api": "https://api.custom.com/v1",
        "doc": "https://docs.custom.com",
        "env": ["CUSTOM_API_KEY"],
        "models": {
          "custom-large": {
            "name": "Custom Large Model",
            "shortName": "Custom L",
            "attachment": true,
            "reasoning": true,
            "temperature": true,
            "tool_call": true,
            "knowledge": "2025-01",
            "release_date": "2025-01-01",
            "last_updated": "2025-01-01",
            "modalities": {
              "input": ["text", "image"],
              "output": ["text"]
            },
            "open_weights": false,
            "limit": {
              "context": 128000,
              "output": 4096
            }
          }
        },
        "aliases": {
          "large": "custom-large"
        }
      }
    }
  },
  "provider": {
    "openrouter": {
      "options": {
        "apiKey": "your-openrouter-key"
      }
    },
    "together": {
      "options": {
        "apiKey": "your-together-key"
      }
    },
    "custom": {
      "options": {
        "apiKey": "your-custom-key"
      }
    }
  }
}
```

### 使用

配置完成后，重启 Neovate Code：

```bash
neo
```

选择模型：
```
/model
```

你会看到所有自定义提供商的模型：
- openrouter/anthropic/claude-3.5-sonnet
- openrouter/openai/gpt-4o
- together/meta-llama/Llama-3-70b-chat-hf
- custom/custom-large

或者使用别名：
```
/model
# 输入: claude   (对应 openrouter/anthropic/claude-3.5-sonnet)
# 或输入: gpt4    (对应 openrouter/openai/gpt-4o)
# 或输入: large   (对应 custom/custom-large)
```

### 环境变量方式

如果你不想在配置文件中存储 API Key，可以使用环境变量：

```bash
export OPENROUTER_API_KEY="sk-or-..."
export TOGETHER_API_KEY="..."
export CUSTOM_API_KEY="..."
```

然后在配置文件中不需要设置 `provider.options.apiKey`。

### 项目级配置

你也可以在项目中使用不同的配置：

```bash
cd your-project
mkdir -p .neovate
cp examples/custom-provider/.neovate.config.example.json .neovate/config.json
```

编辑 `.neovate/config.json`，这个配置只对当前项目生效。

---

## 最佳实践

1. **使用 `opts.createOpenAICompatible`**：对于大多数 OpenAI 兼容的 API，使用此方法可以获得更好的兼容性

2. **引用内置模型定义**：如果自定义模型与内置模型相似，可以引用内置定义：
   ```typescript
   models: {
     'my-model': opts.models['gpt-4o'],
   }
   ```

3. **提供完整的模型信息**：自定义模型时，提供完整的元数据以确保所有功能正常工作

4. **处理 API Key**：支持多种 API Key 配置方式（环境变量、配置文件、options）

5. **添加文档链接**：在 `doc` 字段中提供提供商的文档链接

6. **使用模型别名**：为常用模型添加简短的别名，方便用户使用

7. **错误处理**：在 `createModel` 中进行必要的验证和错误处理

8. **代理支持**：通过 `options.httpProxy` 或全局代理配置支持代理

## 注意事项

- `provider` 钩子的类型是 `SeriesLast`，这意味着后面的插件会覆盖前面的同名提供商
- 使用 `...memo` 可以保留其他插件添加的提供商
- 确保 `env` 数组包含正确的环境变量名称
- API Key 的优先级：`options.apiKey` > 环境变量
- 如果使用 OpenAI 兼容 API，建议使用 `createOpenAICompatible` 而不是 `createOpenAI`

## 完整示例

查看 `index.ts` 文件了解如何将插件集成到自定义代码代理中。

## 相关文档

- [Neovate Code 插件文档](https://neovateai.dev/docs/plugins)
- [插件钩子文档](https://neovateai.dev/docs/plugin-hooks)
- [内置提供商](https://github.com/neovateai/neovate-code/blob/main/src/model.ts)
