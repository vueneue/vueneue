import Vue from 'vue';
import startApp from './startApp';
import createContext from '../utils/createContext';
import { createApp, initApp } from '@/main';
import ErrorPage from '@/vueneue/ErrorPage';

/**
 * Vue start
 */
export default async ssrContext => {
  // Create app
  const context = createContext(ssrContext);
  context.app = createApp(context);
  context.ssr = ssrContext;

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
};
