import Vue from 'vue';
import './vuePlugins';
import { createStore, createRouter } from '!../generated';
import errorStore from './errorStore';
import errorHandler from './errorHandler';

export default ssrContext => {
  const router = createRouter();
  const store = createStore();

  // Add errorHandler module to Vuex
  store.registerModule('errorHandler', errorStore);

  // Read data from SSR
  if (process.client && process.ssr && window.__DATA__) {
    const { state } = window.__DATA__;
    store.replaceState(state);
  }

  const context = {
    ...ssrContext,
    router,
    store,
    error(error, statusCode = 500) {
      errorHandler(context, {
        error,
        statusCode,
      });
    },
  };

  Vue.prototype.$context = context;

  return context;
};
