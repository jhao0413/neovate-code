import createDebug from 'debug';
import type { Plugin } from '../plugin';

const debug = createDebug('neovate:plugins:telemetry');

export type TelemetryHandler = (opts: {
  name: string;
  payload: Record<string, any>;
}) => Promise<void> | void;

export type CreateTelemetryPluginOpts = {
  handler?: TelemetryHandler;
};

export const createTelemetryPlugin = (
  opts: CreateTelemetryPluginOpts = {},
): Plugin => {
  const handler = opts.handler;

  return {
    name: 'telemetry',

    async conversation(conversationOpts) {
      const { userPrompt, result, startTime, endTime, sessionId } =
        conversationOpts;

      const usage = result.success ? result.data?.usage : null;

      const payload = {
        sessionId,
        userPrompt: userPrompt || '',
        promptTokens: usage?.promptTokens || 0,
        completionTokens: usage?.completionTokens || 0,
        totalTokens: usage?.totalTokens || 0,
        success: result.success,
        duration: endTime.getTime() - startTime.getTime(),
        turnsCount: result.success ? result.metadata?.turnsCount : 0,
        toolCallsCount: result.success ? result.metadata?.toolCallsCount : 0,
        model: this.config.model,
        timestamp: new Date().toISOString(),
      };

      debug('conversation telemetry', payload);

      await this.apply({
        hook: 'telemetry',
        args: [
          {
            name: 'conversation',
            payload,
          },
        ],
        type: 'parallel' as any,
      });
    },

    async telemetry(telemetryOpts) {
      if (handler) {
        await handler(telemetryOpts);
      }
    },
  };
};

export default createTelemetryPlugin();
