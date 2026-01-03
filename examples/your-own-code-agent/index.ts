import { type Plugin, runNeovate } from '../../src/index';
import myTelemetryPlugin from './my-telemetry';

const plugin: Plugin = {
  name: 'my-plugin',
  context: () => {
    // 添加更多上下文
    return {
      'Who am I': 'chencheng',
    };
  },
  slashCommand() {
    return [
      {
        type: 'prompt',
        name: 'foo',
        description: 'foo',
        getPromptForCommand: async () => {
          return [
            {
              role: 'user',
              content: 'print the version of @package.json',
            },
          ];
        },
      },
    ];
  },
};

const myPlugin: Plugin = {
  config({ config, argvConfig }) {
    return {
      model: argvConfig.model || config.model || 'cc/claude-opus-4-5',
      smallModel:
        argvConfig.smallModel || config.smallModel || 'cc/claude-haiku-4-5',
    };
  },
  provider(memo, opts) {
    return {
      cc: {
        id: 'cc',
        env: [],
        name: 'cc',
        doc: 'https://sorrycc.com',
        models: {
          'claude-opus-4-5': opts.models['claude-opus-4-5'], // 保持键名一致
          'claude-haiku-4-5': opts.models['claude-haiku-4-5'],
        },
        createModel(name, _provider) {
          // 模型名称映射： key -> API 期望的模型 ID
          const modelMapping: Record<string, string> = {
            'claude-opus-4-5': 'claude-opus-4-5-20251101',
            'claude-haiku-4-5': 'claude-opus-4-5-20251101', // 如果 API 不支持 haiku，都用 opus
          };
          const actualModelName = modelMapping[name] || name;

          const anthropic = opts.createAnthropic({
            apiKey: 'sk-SRaHPWgM7dTk6jgwBjKihQHTYuXiv1u2xr3fjUYYREwIlgzu',
            baseURL: 'https://api.ikuncode.cc/v1', // SDK 会自动加 /messages
          });

          const model = anthropic.chat(actualModelName);

          return model;
        },
      },
      ...memo,
    };
  },
};

runNeovate({
  productName: 'MyCodeAgent',
  version: '0.1.0',
  plugins: [myPlugin, plugin, myTelemetryPlugin],
}).catch(console.error);
