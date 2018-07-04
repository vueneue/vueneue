import Vue from 'vue';
import startApp from './startApp';
import createContext from '../utils/createContext';
import { createApp, initApp } from '@/main';

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

  // Start application
  return startApp(context);
};
