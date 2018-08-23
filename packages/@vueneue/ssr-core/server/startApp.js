import { resolveComponentsAsyncData } from '../utils/asyncData';
import { handleMiddlewares } from '../utils/middlewares';
import errorHandler from '../utils/errorHandler';
import { getContext } from '../utils/context';
import { doRedirect } from '../utils/redirect';

/**
 * Start application
 */
export default async context => {
  const { app, router, store, url, ssr } = context;

  return new Promise((resolve, reject) => {
    // Attach meta for SSR
    if (app.$meta) ssr.meta = app.$meta();

    // Send router for SSR/Pre-rendering
    ssr.router = router;

    // Send url to router
    router.push(url);

    router.onReady(async () => {
      const _context = getContext(context);

      try {
        // Middlewares
        await handleMiddlewares(_context);

        // Store init function
        if (store._actions.onHttpRequest) {
          await store.dispatch('onHttpRequest', _context);
        }

        const components = await resolveComponentsAsyncData(
          router.currentRoute,
          router.getMatchedComponents(),
          _context,
        );

        ssr.data = {
          components,
          state: store.state,
        };

        resolve(app);
      } catch (error) {
        // Handle redirections
        if (error.message === 'ROUTER_REDIRECT') {
          doRedirect(_context, error);
        } else {
          // Handle errors
          errorHandler(_context, {
            error: error.stack || error.message || error,
            statusCode: error.statusCode || 500,
          });
        }

        ssr.data = {
          components: [],
          state: store.state,
        };

        resolve(app);
      }
    }, reject);
  });
};
