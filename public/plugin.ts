import { i18n } from '@kbn/i18n';
import { AppMountParameters, CoreSetup, CoreStart, Plugin } from '../../../src/core/public';
import {
  KibanaElasticsearchStatusPluginPluginSetup,
  KibanaElasticsearchStatusPluginPluginStart,
  AppPluginStartDependencies,
} from './types';
import { PLUGIN_NAME } from '../common';

export class KibanaElasticsearchStatusPluginPlugin
  implements
    Plugin<KibanaElasticsearchStatusPluginPluginSetup, KibanaElasticsearchStatusPluginPluginStart> {
  public setup(core: CoreSetup): KibanaElasticsearchStatusPluginPluginSetup {
    // Register an application into the side navigation menu
    core.application.register({
      id: 'kibanaElasticsearchStatusPlugin',
      title: PLUGIN_NAME,
      async mount(params: AppMountParameters) {
        // Load application bundle
        const { renderApp } = await import('./application');
        // Get start services as specified in kibana.json
        const [coreStart, depsStart] = await core.getStartServices();
        // Render the application
        return renderApp(coreStart, depsStart as AppPluginStartDependencies, params);
      },
    });

    // Return methods that should be available to other plugins
    return {
      getGreeting() {
        return i18n.translate('kibanaElasticsearchStatusPlugin.greetingText', {
          defaultMessage: 'Hello from {name}!',
          values: {
            name: PLUGIN_NAME,
          },
        });
      },
    };
  }

  public start(core: CoreStart): KibanaElasticsearchStatusPluginPluginStart {
    return {};
  }

  public stop() {}
}
