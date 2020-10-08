import { PluginInitializerContext } from '../../../src/core/server';
import { KibanaElasticsearchStatusPluginPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new KibanaElasticsearchStatusPluginPlugin(initializerContext);
}

export {
  KibanaElasticsearchStatusPluginPluginSetup,
  KibanaElasticsearchStatusPluginPluginStart,
} from './types';
