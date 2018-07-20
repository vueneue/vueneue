import Vue from 'vue';
import { createStore, createRouter } from '!../generated';
import errorStore from './errorStore';
import errorHandler from './errorHandler';

export const createContext = ssrContext => {
  const router = createRouter();
  const store = createStore();

  // Add errorHandler module to Vuex
  store.registerModule('errorHandler', errorStore);

  // Read data from SSR
  if (process.client && process.ssr && window.__DATA__) {
    const { state } = window.__DATA__;
    store.replaceState(state);
  }

  // Create context object
  const context = {
    ...ssrContext,
    router,
    store,
    // Add error helper function
    error(error, statusCode = 500) {
      errorHandler(context, {
        error,
        statusCode,
      });
    },
  };

  // Add context to all components
  Vue.prototype.$context = context;

  return context;
};

/**
 * Return a new instance of context with route helpers
 */
export const getContext = context => {
  const { router } = context;
  return {
    ...context,
    route: router.currentRoute,
    params: router.currentRoute.params,
    query: router.currentRoute.query,
  };
};
