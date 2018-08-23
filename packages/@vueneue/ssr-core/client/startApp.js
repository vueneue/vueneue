import errorHandler from '../utils/errorHandler';
import { resolveComponentsAsyncData } from '../utils/asyncData';
import { addHotReload } from '../utils/hmr';
import { handleMiddlewares } from '../utils/middlewares';
import { handleHMRMiddlewares } from '../utils/hmr';
import { getContext } from '../utils/context';
import { doRedirect } from '../utils/redirect';

/**
 * Start application
 */
export default async context => {
  const { app, router, store } = context;

  /**
   * Handling middlewares HMR
   */
  if (process.dev && process.client) {
    handleHMRMiddlewares(context);
  }

  return new Promise(resolve => {
    router.onReady(async () => {
      // Clear errors on route leave
      router.beforeEach((to, from, next) => {
        if (store.state.errorHandler.error) {
          store.commit('errorHandler/CLEAR');
        }
        next();
      });

      // After each
      router.afterEach(() => {
        app.$nextTick(() => {
          // Add hot reload async Data
          addHotReload(context);
        });
      });

      // Handling asyncData() method on route change
      router.beforeResolve(async (to, from, next) => {
        const _context = getContext(context, to);

        try {
          // Middlewares
          await handleMiddlewares(_context, to);

          // Resolve asyncData()
          await resolveComponentsAsyncData(
            to,
            router.getMatchedComponents(to),
            _context,
          );
        } catch (error) {
          // Handle redirection
          if (error.message === 'ROUTER_REDIRECT') {
            return next(error.href);
          } else {
            // Handle error
            app.$emit('router.error', error);
            errorHandler(_context, { error });
            return next();
          }
        }

        next();
      });

      // SPA
      if (!process.ssr || window.__SPA_ROUTE__) {
        const _context = getContext(context);

        try {
          // Middlewares
          await handleMiddlewares(_context);

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
          // Handle redirection
          if (error.message === 'ROUTER_REDIRECT') {
            doRedirect(_context, error);
          } else {
            // Handle error
            errorHandler(_context, { error });
          }
        }
      }

      /**
       * Mount app
       */
      if (!process.test) app.$mount('#app');

      app.$nextTick(() => {
        // Emi event on app mount
        app.$emit('app.mounted');

        // Add hot reload on pages
        addHotReload(getContext(context));
      });

      resolve(context);
    });
  });
};
