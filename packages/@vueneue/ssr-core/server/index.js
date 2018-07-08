import Vue from 'vue';
import startApp from './startApp';
import createContext from '../utils/createContext';
import { createApp, initApp } from '@/main';
import notFound from '../utils/notFound';

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
  notFound(context.router);

  // Start application
  return startApp(context);
};
