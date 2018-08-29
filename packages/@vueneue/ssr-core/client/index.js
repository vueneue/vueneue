if (module.hot) module.hot.accept();

import '../utils/vuePlugins';
import startApp from './startApp';
import { createContext } from '../utils/context';
import { createApp, pluginsInit } from '../boot';
import notFound from '../utils/notFound';
import { getRedirect } from '../utils/redirect';
import { getAppCreated } from '../utils/appCreated';

/**
 * Vue start
 */
(async () => {
  // Create context
  const context = createContext();

  // Add redirect function
  context.redirect = getRedirect(context);

  // App created callbacks
  const appCreated = getAppCreated(context);
  context.appCreated = appCreated;

  // Call plugins init
  await pluginsInit(context);

  // Create application
  context.app = createApp(context);

  // Run create callbacks
  delete context.appCreated;
  appCreated.run(context);

  // Add Error page for 404/Not found
  notFound(context.router);

  // Start application
  return startApp(context);
})();
