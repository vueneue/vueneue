import Vue from 'vue';
import errorHandler from '../utils/errorHandler';
import { resolveComponentsAsyncData } from '../utils/asyncData';
import { addHotReload } from '../utils/hmr';
import { handleMiddlewares } from '../utils/middlewares';
import { handleHMRMiddlewares } from '../utils/hmr';
import { getContext } from '../utils/context';

/**
 * Start application
 */
export default async context => {
  const { app, router, store } = context;

  /**
   * Define redirect function
   */
  context.redirect = location => {
    const redirectError = new Error('ROUTER_REDIRECT');
    redirectError.href = router.resolve(location, router.currentRoute).href;
    throw redirectError;
  };

  /**
   * Handling HMR
   */
  if (process.dev && process.client) {
    handleHMRMiddlewares(context);
  }

  Vue.prototype.$redirect = function(location) {
    router.replace(location);
  };

  return new Promise(resolve => {
    router.onReady(async () => {
      // Clear errors on route leave
      router.beforeEach((to, from, next) => {
        store.commit('errorHandler/CLEAR');
        next();
      });

      // After each
      router.afterEach(() => {
        app.$nextTick(() => {
          addHotReload(context);
        });
      });

      // Handling asyncData() method on route change
      router.beforeResolve(async (to, from, next) => {
        const _context = getContext(context, to);

        try {
          // Middlewares
          await handleMiddlewares(to, _context);

          await resolveComponentsAsyncData(
            to,
            router.getMatchedComponents(to),
            _context,
          );
        } catch (error) {
          if (error.message === 'ROUTER_REDIRECT') {
            return next(error.href);
          } else {
            errorHandler(_context, { error });
          }
        }

        next();
      });

      // SPA
      if (!process.ssr || window.__SPA_ROUTE__) {
        const _context = getContext(context);

        try {
          // Middlewares
          await handleMiddlewares(router.currentRoute, _context);

          // Store init function on SPA Mode
          if (store._actions.onHttpRequest) {
            await store.dispatch('onHttpRequest', _context);
          }

          // first call => asyncData
          await resolveComponentsAsyncData(
            router.currentRoute,
            router.getMatchedComponents(),
            _context,
          );
        } catch (error) {
          if (error.message === 'ROUTER_REDIRECT') {
            window.location.replace(error.href);
          } else {
            errorHandler(_context, { error });
          }
        }
      }

      /**
       * Mount app
       */
      if (!process.test) app.$mount('#app');

      app.$nextTick(() => {
        addHotReload(getContext(context));
      });

      resolve(context);
    });
  });
};
