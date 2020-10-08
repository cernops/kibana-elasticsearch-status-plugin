import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import {
  KibanaElasticsearchStatusPluginPluginSetup,
  KibanaElasticsearchStatusPluginPluginStart,
} from './types';
import { defineRoutes } from './routes';

export class KibanaElasticsearchStatusPluginPlugin
  implements
    Plugin<KibanaElasticsearchStatusPluginPluginSetup, KibanaElasticsearchStatusPluginPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('kibana-elasticsearch-status-plugin: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('kibana-elasticsearch-status-plugin: Started');
    return {};
  }

  public stop() {}
}
