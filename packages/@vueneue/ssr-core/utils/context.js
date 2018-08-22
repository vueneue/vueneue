import Vue from 'vue';
import { createStore, createRouter } from '../boot';
import errorStore from './errorStore';
import errorHandler from './errorHandler';
import { doRedirect } from './redirect';

export const createContext = ssrContext => {
  const router = createRouter();
  const store = createStore();

  // Add errorHandler module to Vuex
  store.registerModule('errorHandler', errorStore);

  // Read data from SSR and hydrate store
  if (process.client && process.ssr && window.__DATA__) {
    const { state } = window.__DATA__;
    store.replaceState(state);
  }

  // Create context object
  const context = {
    ...ssrContext,
    router,
    store, // Add error helper function
    error(error, statusCode = 500) {
      errorHandler(context, {
        error,
        statusCode,
      });
    },
  };

  // Add context to all components
  Vue.prototype.$context = context;

  // Error handler
  Vue.config.errorHandler = (error, vm, info) => {
    if (error.message === 'ROUTER_REDIRECT') {
      return doRedirect(context, error);
    }
    errorHandler(context, {
      error,
      vm,
      info,
    });
  };

  // Catch redirect in router
  router.onError(err => {
    if (err.message === 'ROUTER_REDIRECT') {
      doRedirect(getContext(context), {
        href: err.href,
        statusCode: err.statusCode,
      });
    }
  });

  return context;
};

/**
 * Return a new instance of context with route helpers
 */
export const getContext = (context, to) => {
  const { router } = context;
  const route = to || context.route || router.currentRoute;

  if (!context.url) {
    if (route) {
      context.url = route.fullPath;
    } else if (process.client) {
      context.url = window.location.toString();
    }
  }

  return {
    ...context,
    route,
    params: route.params,
    query: route.query,
  };
};
