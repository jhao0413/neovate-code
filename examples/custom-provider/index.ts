import { type Plugin, runNeovate } from '../../src/index';
import simplePlugin from './plugin-simple';

const myCustomCodeAgent: Plugin = {
  name: 'my-custom-code-agent',

  config({ config, argvConfig }) {
    return {
      model: argvConfig.model || config.model || 'my-provider/my-awesome-model',
      smallModel:
        argvConfig.smallModel ||
        config.smallModel ||
        'my-provider/my-fast-model',
    };
  },

  context() {
    return {
      'Custom Agent': 'This is my custom code agent with custom providers.',
    };
  },
};

runNeovate({
  productName: 'MyCustomAgent',
  version: '1.0.0',
  plugins: [simplePlugin, myCustomCodeAgent],
}).catch(console.error);
