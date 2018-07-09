import Vue from 'vue';
import { resolveComponentsAsyncData } from '../utils/asyncData';
import { handleMiddlewares } from '../utils/middlewares';
import errorHandler from '../utils/errorHandler';

/**
 * Start application
 */
export default async context => {
  const { app, router, store, ctx, url, ssr } = context;

  /**
   * Define redirect function
   */
  context.redirect = (location, statusCode = 301) => {
    const routerResult = router.resolve(location, router.currentRoute);
    ctx.response.status = statusCode;
    if (routerResult) {
      ctx.redirect(routerResult.href);
    } else {
      ctx.redirect(location);
    }
    ssr.redirected = statusCode;
  };

  Vue.prototype.$redirect = context.redirect;

  return new Promise((resolve, reject) => {
    // Attach meta for SSR
    if (app.$meta) ssr.meta = app.$meta();

    // Http asyncData
    ssr.asyncData = {};

    // Send router for SSR/Pre-rendering
    ssr.router = router;

    // Send url to router
    router.push(url);

    router.onReady(async () => {
      try {
        // Middlewares
        await handleMiddlewares(router.currentRoute, context);

        // Store init function
        if (store._actions.onHttpRequest) {
          await store.dispatch('onHttpRequest', {
            ...context,
            route: router.currentRoute,
            params: router.currentRoute.params,
            query: router.currentRoute.query,
          });
        }

        if (router.currentRoute.name === 'pageNotFound') {
          const error = new Error('Page not found');
          error.statusCode = 404;
          throw error;
        }

        const data = await resolveComponentsAsyncData(
          router.currentRoute,
          router.getMatchedComponents(),
          context,
        );

        ssr.asyncData = data;
        ssr.state = store.state;
        resolve(app);
      } catch (error) {
        errorHandler(context, {
          error: error.stack || error.message || error,
          statusCode: error.statusCode || 500,
        });

        ssr.asyncData = [];
        ssr.state = store.state;
        resolve(app);
      }
    }, reject);
  });
};
