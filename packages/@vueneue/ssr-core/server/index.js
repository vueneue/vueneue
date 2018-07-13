import Vue from 'vue';
import startApp from './startApp';
import createContext from '../utils/createContext';
import createApp from '@/main';
import pluginsInit from '../generated/plugins';
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
  await pluginsInit(context);

  // Add Error page for 404/Not found
  notFound(context.router);

  // Start application
  return startApp(context);
};
