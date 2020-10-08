import './index.scss';

import { KibanaElasticsearchStatusPluginPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new KibanaElasticsearchStatusPluginPlugin();
}
export {
  KibanaElasticsearchStatusPluginPluginSetup,
  KibanaElasticsearchStatusPluginPluginStart,
} from './types';
