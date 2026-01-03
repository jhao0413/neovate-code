import type {
  LanguageModelV2,
  OpenAICompatibleProvider,
  AnthropicProvider,
  OpenAIProvider,
} from '@ai-sdk/openai';

export type {
  LanguageModelV2,
  OpenAICompatibleProvider,
  AnthropicProvider,
  OpenAIProvider,
} from '@ai-sdk/openai';

export interface ProviderConfig {
  id?: string;
  name?: string;
  env?: string[];
  apiEnv?: string[];
  api?: string;
  doc?: string;
  models?: Record<string, string | ModelConfig>;
  createModel?: (
    name: string,
    provider: Provider,
    options: ProviderCreateOptions,
  ) => Promise<LanguageModelV2> | LanguageModelV2;
  options?: {
    baseURL?: string;
    apiKey?: string;
    headers?: Record<string, string>;
    httpProxy?: string;
  };
}

export interface ProviderCreateOptions {
  globalConfigDir: string;
  setGlobalConfig: (key: string, value: string, isGlobal: boolean) => void;
}

export interface ModelConfig {
  name: string;
  shortName?: string;
  attachment: boolean;
  reasoning: boolean;
  temperature: boolean;
  tool_call: boolean;
  knowledge: string;
  release_date: string;
  last_updated: string;
  modalities: {
    input: ('text' | 'image' | 'audio' | 'video' | 'pdf')[];
    output: ('text' | 'audio' | 'image')[];
  };
  open_weights: boolean;
  limit: {
    context: number;
    output: number;
  };
}

export interface ProviderHookOpts {
  models: Record<string, ModelConfig>;
  defaultModelCreator: (name: string, provider: Provider) => LanguageModelV2;
  createOpenAI: (options: any) => OpenAIProvider;
  createOpenAICompatible: (options: any) => OpenAICompatibleProvider;
  createAnthropic: (options: any) => AnthropicProvider;
}

export type Provider = Required<Pick<ProviderConfig, 'id' | 'name' | 'doc'>> &
  Omit<ProviderConfig, 'id' | 'name' | 'doc'> & {
    id: string;
    name: string;
    doc: string;
    createModel: (
      name: string,
      provider: Provider,
      options: ProviderCreateOptions,
    ) => Promise<LanguageModelV2> | LanguageModelV2;
  };
