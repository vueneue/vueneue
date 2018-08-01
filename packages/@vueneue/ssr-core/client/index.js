if (module.hot) module.hot.accept();

import '../utils/vuePlugins';
import Vue from 'vue';
import startApp from './startApp';
import errorHandler from '../utils/errorHandler';
import { createContext } from '../utils/context';
import { createApp, pluginsInit } from '../boot';
import notFound from '../utils/notFound';

/**
 * Vue start
 */
(async () => {
  // Create context
  const context = createContext();

  // Create application
  context.app = createApp(context);

  // Error handler
  Vue.config.errorHandler = (error, vm, info) => {
    errorHandler(context, { error, vm, info });
  };

  // Call app init
  await pluginsInit(context);

  // Add Error page for 404/Not found
  notFound(context.router);

  // Start application
  return startApp(context);
})();
