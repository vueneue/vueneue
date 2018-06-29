import './vuePlugins';
import createRouter from '@/router';
import createStore from '@/store';
import ErrorPage from '@/vueneue/components/ErrorPage';
import errorStore from './errorStore';
import Vue from 'vue';
import errorHandler from './errorHandler';

export default ssrContext => {
  const router = createRouter();
  const store = createStore();

  // Add Error page for 404/Not found
  router.addRoutes([
    {
      path: '*',
      name: 'pageNotFound',
      component: ErrorPage,
      props: { 'status-code': 404 },
    },
  ]);

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
