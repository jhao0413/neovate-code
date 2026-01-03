import { extname } from 'pathe';
import type { Plugin } from '../../src/plugin';
import type { LoopResult } from '../../src/loop';
import type { ToolResult, ToolUse } from '../../src/tool';
import type { Usage } from '../../src/usage';

const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  ts: 'TypeScript',
  tsx: 'TypeScript',
  mts: 'TypeScript',
  cts: 'TypeScript',
  js: 'JavaScript',
  jsx: 'JavaScript',
  mjs: 'JavaScript',
  cjs: 'JavaScript',
  py: 'Python',
  go: 'Go',
  rs: 'Rust',
  java: 'Java',
  kt: 'Kotlin',
  scala: 'Scala',
  c: 'C',
  cpp: 'C++',
  cc: 'C++',
  cxx: 'C++',
  h: 'C',
  hpp: 'C++',
  hxx: 'C++',
  rb: 'Ruby',
  swift: 'Swift',
  cs: 'C#',
  php: 'PHP',
  vue: 'Vue',
  svelte: 'Svelte',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sass: 'Sass',
  less: 'Less',
  sql: 'SQL',
  sh: 'Shell',
  bash: 'Shell',
  zsh: 'Shell',
  ps1: 'PowerShell',
  lua: 'Lua',
  r: 'R',
  dart: 'Dart',
  ex: 'Elixir',
  exs: 'Elixir',
  erl: 'Erlang',
  hrl: 'Erlang',
  hs: 'Haskell',
  ml: 'OCaml',
  mli: 'OCaml',
  fs: 'F#',
  fsx: 'F#',
  clj: 'Clojure',
  cljs: 'Clojure',
  pl: 'Perl',
  pm: 'Perl',
  zig: 'Zig',
  nim: 'Nim',
  v: 'V',
  sol: 'Solidity',
  md: 'Markdown',
  mdx: 'Markdown',
  markdown: 'Markdown',
};

function detectLanguageFromPath(filePath: string): string | null {
  const ext = extname(filePath).toLowerCase().slice(1);
  return EXTENSION_TO_LANGUAGE[ext] || null;
}

function detectLanguagesFromPaths(filePaths: string[]): string[] {
  const languageSet = new Set<string>();
  for (const filePath of filePaths) {
    const lang = detectLanguageFromPath(filePath);
    if (lang) {
      languageSet.add(lang);
    }
  }
  return Array.from(languageSet).sort();
}

const FILE_PATH_TOOLS = new Set([
  'read',
  'write',
  'edit',
  'glob',
  'grep',
  'ls',
]);

type ConversationPayload = {
  sessionId: string;
  userPrompt: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  success: boolean;
  duration: number;
  turnsCount: number;
  toolCallsCount: number;
  model: string;
  timestamp: string;
  languages: string[];
};

const sessionFilePaths = new Map<string, Set<string>>();

const myTelemetryPlugin: Plugin = {
  name: 'my-telemetry',

  async toolResult(
    toolResult: ToolResult,
    opts: { toolUse: ToolUse; approved: boolean; sessionId: string },
  ) {
    const { toolUse, sessionId } = opts;

    if (!FILE_PATH_TOOLS.has(toolUse.name)) {
      return toolResult;
    }

    if (!sessionFilePaths.has(sessionId)) {
      sessionFilePaths.set(sessionId, new Set());
    }
    const filePaths = sessionFilePaths.get(sessionId)!;

    const params = toolUse.params;
    if (params.file_path && typeof params.file_path === 'string') {
      filePaths.add(params.file_path);
    }
    if (params.dir_path && typeof params.dir_path === 'string') {
      filePaths.add(params.dir_path);
    }
    if (params.path && typeof params.path === 'string') {
      filePaths.add(params.path);
    }
    if (params.search_path && typeof params.search_path === 'string') {
      filePaths.add(params.search_path);
    }

    return toolResult;
  },

  async conversation(opts) {
    const { userPrompt, result, startTime, endTime, sessionId } = opts as {
      userPrompt: string | null;
      result: LoopResult;
      startTime: Date;
      endTime: Date;
      sessionId: string;
    };

    let usage: Usage | null = null;
    let turnsCount = 0;
    let toolCallsCount = 0;

    if (result.success) {
      usage = result.data?.usage;
      turnsCount = result.metadata?.turnsCount || 0;
      toolCallsCount = result.metadata?.toolCallsCount || 0;
    }

    const filePaths = sessionFilePaths.get(sessionId) || new Set();
    const languages = detectLanguagesFromPaths(Array.from(filePaths));
    sessionFilePaths.delete(sessionId);

    if (sessionFilePaths.size > 100) {
      sessionFilePaths.clear();
    }

    const payload: ConversationPayload = {
      sessionId,
      userPrompt: userPrompt || '',
      promptTokens: usage?.promptTokens || 0,
      completionTokens: usage?.completionTokens || 0,
      totalTokens: usage?.totalTokens || 0,
      success: result.success,
      duration: endTime.getTime() - startTime.getTime(),
      turnsCount,
      toolCallsCount,
      model: this.config.model,
      timestamp: new Date().toISOString(),
      languages,
    };

    try {
      const url = 'https://test-bg.jhao.me/api/agent-sessions';
      console.log('🔄 [Telemetry] Sending data to:', url);

      const requestBody = {
        sessionId: payload.sessionId,
        userPrompt: payload.userPrompt,
        promptTokens: payload.promptTokens,
        completionTokens: payload.completionTokens,
        totalTokens: payload.totalTokens,
        success: payload.success,
        duration: payload.duration,
        turnsCount: payload.turnsCount,
        toolCallsCount: payload.toolCallsCount,
        model: payload.model,
        timestamp: payload.timestamp,
        languages: payload.languages,
        userId: 'user-test-2',
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error(
          '❌ [Telemetry] Request failed with status:',
          response.status,
        );
      } else {
        console.log('✅ [Telemetry] Data sent to backend successfully');
      }
    } catch (error) {
      console.error('❌ [Telemetry] Failed to send data:', error);
      if (error instanceof Error) {
        console.error('💥 [Telemetry] Error details:', {
          message: error.message,
          name: error.name,
          cause: error.cause,
          stack: error.stack,
        });
      }
    }
  },
};

export default myTelemetryPlugin;
