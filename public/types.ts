import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface KibanaElasticsearchStatusPluginPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface KibanaElasticsearchStatusPluginPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
