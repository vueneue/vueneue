import '../utils/vuePlugins';
import startApp from './startApp';
import { createContext } from '../utils/context';
import { createApp, pluginsInit } from '../boot';
import notFound from '../utils/notFound';

/**
 * Vue start
 */
export default async ssrContext => {
  // Create app
  const context = createContext(ssrContext);
  context.app = createApp(context);
  context.ssr = ssrContext;

  // Call app init
  await pluginsInit(context);

  // Add Error page for 404/Not found
  notFound(context.router);

  // Start application
  return startApp(context);
};
