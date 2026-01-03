import { type Plugin, runNeovate } from '../../src/index';

const configurablePlugin: Plugin = {
  name: 'custom-provider-configurable',

  config({ config, argvConfig }) {
    const extensions = config.extensions || {};

    return {
      model: argvConfig.model || config.model,
    };
  },

  provider(memo, opts) {
    const extensions = this.config.extensions || {};
    const customProviders = extensions.customProviders || {};

    const providers: Record<string, any> = {};

    Object.entries(customProviders).forEach(
      ([providerId, providerConfig]: [string, any]) => {
        providers[providerId] = {
          id: providerId,
          env: providerConfig.env || [],
          name: providerConfig.name || providerId,
          apiEnv: providerConfig.apiEnv,
          api: providerConfig.api,
          doc: providerConfig.doc || '',
          models: {},
          createModel(name: string, provider: any) {
            const apiKey =
              provider.options?.apiKey || process.env[providerConfig.env?.[0]];
            const baseURL = provider.options?.baseURL || provider.api;

            return opts.createOpenAICompatible({
              name: provider.id,
              baseURL,
              apiKey,
              headers: providerConfig.headers,
            })(name);
          },
          options: {
            ...providerConfig.options,
          },
        };

        if (providerConfig.models) {
          Object.entries(providerConfig.models).forEach(
            ([modelId, modelRef]: [string, any]) => {
              if (typeof modelRef === 'string') {
                providers[providerId].models[modelId] =
                  opts.models[modelRef] || opts.models['gpt-4o'];
              } else {
                providers[providerId].models[modelId] = modelRef;
              }
            },
          );
        }
      },
    );

    return {
      ...providers,
      ...memo,
    };
  },

  modelAlias(memo) {
    const extensions = this.config.extensions || {};
    const customProviders = extensions.customProviders || {};
    const aliases: Record<string, string> = {};

    Object.entries(customProviders).forEach(
      ([providerId, providerConfig]: [string, any]) => {
        if (providerConfig.aliases) {
          Object.entries(providerConfig.aliases).forEach(([alias, modelId]) => {
            aliases[alias] = `${providerId}/${modelId as string}`;
          });
        }
      },
    );

    return {
      ...aliases,
      ...memo,
    };
  },
};

export default configurablePlugin;
