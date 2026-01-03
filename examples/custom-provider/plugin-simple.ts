import { type Plugin } from '../../src/index';

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
          const apiKey =
            provider.options?.apiKey || process.env.MY_CUSTOM_API_KEY;
          const baseURL = provider.options?.baseURL || provider.api;

          return opts.createOpenAICompatible({
            name: provider.id,
            baseURL,
            apiKey,
          })(name);
        },
      },
      ...memo,
    };
  },
};

export default simplePlugin;
