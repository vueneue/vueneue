if (module.hot) module.hot.accept();

import Vue from 'vue';
import startApp from './startApp';
import errorHandler from '../utils/errorHandler';
import createContext from '../utils/createContext';
import { createApp, initApp } from '@/main';
import ErrorPage from '@/vueneue/ErrorPage';

/**
 * Vue start
 */
(async () => {
  // Create application
  const context = createContext();
  context.app = createApp(context);

  // Error handler
  Vue.config.errorHandler = (error, vm, info) => {
    errorHandler(context, { error, vm, info });
  };

  // Context variable
  Vue.prototype.$context = context;

  // Call app init
  await initApp(context);

  // Add Error page for 404/Not found
  context.router.addRoutes([
    {
      path: '*',
      name: 'pageNotFound',
      component: ErrorPage,
      props: { 'status-code': 404 },
    },
  ]);

  // Start application
  return startApp(context);
})();
