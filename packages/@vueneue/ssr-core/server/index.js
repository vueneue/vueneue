import '../utils/vuePlugins';
import startApp from './startApp';
import { createContext } from '../utils/context';
import { createApp, pluginsInit } from '../boot';
import notFound from '../utils/notFound';
import getRedirectFunction from '../utils/redirect';

/**
 * Vue start
 */
export default async ssrContext => {
  // Create context
  const context = createContext(ssrContext);
  context.ssr = ssrContext;

  // Create application
  context.app = createApp(context);

  // Add redirect function
  context.redirect = getRedirectFunction(context);

  // Call app init
  await pluginsInit(context);

  // Add Error page for 404/Not found
  notFound(context.router);

  // Start application
  return startApp(context);
};
