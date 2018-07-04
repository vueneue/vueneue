import Vue from 'vue';
import errorHandler from '../utils/errorHandler';
import { resolveComponentsAsyncData } from '../utils/asyncData';
import { handleHMRAsyncData } from '../utils/hmr';
import { handleMiddlewares } from '../utils/middlewares';
import { handleHMRMiddlewares } from '../utils/hmr';

/**
 * Start application
 */
export default async context => {
  const { app, router, store } = context;

  /**
   * Define redirect function
   */
  context.redirect = location => {
    router.redirected = router.resolve(location, router.currentRoute);
    router.replace(location);
  };

  /**
   * Handling HMR
   */
  if (process.dev && process.client) {
    handleHMRAsyncData(context);
    handleHMRMiddlewares(context);
  }

  Vue.prototype.$redirect = context.redirect;

  return new Promise(resolve => {
    router.onReady(async () => {
      // Clear errors on route leave
      router.beforeEach((to, from, next) => {
        store.commit('errorHandler/CLEAR');
        next();
      });

      // Handling asyncData() method on route change
      router.beforeResolve(async (to, from, next) => {
        try {
          // Middlewares
          await handleMiddlewares(to, context);

          await resolveComponentsAsyncData(
            to,
            router.getMatchedComponents(to),
            context,
          );

          if (router.redirected) {
            const redirectLocation = router.redirected;
            router.redirected = undefined;
            return next(redirectLocation.location);
          }
        } catch (error) {
          errorHandler(context, { error });
        }

        next();
      });

      // SPA
      if (!process.ssr) {
        try {
          // Store init function on SPA Mode
          if (store._actions.onHttpRequest) {
            await store.dispatch('onHttpRequest', {
              ...context,
              route: router.currentRoute,
              params: router.currentRoute.params,
              query: router.currentRoute.query,
            });
          }

          // first call => asyncData
          await resolveComponentsAsyncData(
            router.currentRoute,
            router.getMatchedComponents(),
            context,
          );
        } catch (error) {
          errorHandler(context, { error });
        }
      }

      /**
       * Mount app
       */
      if (!process.test) app.$mount('#app');

      resolve(context);
    });
  });
};
