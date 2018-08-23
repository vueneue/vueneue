import { sanitizeComponent } from './asyncData';

export const handleMiddlewares = async (context, route) => {
  const { router, app } = context;

  if (!route) route = router.currentRoute;

  const middlwareContext = {
    ...context,
    route,
    params: route.params,
    query: route.query,
  };

  let runMiddlewares = [];

  if (app.$options.middlewares) {
    runMiddlewares = [...runMiddlewares, ...app.$options.middlewares];
  }

  const components = router.getMatchedComponents(route.path);
  for (const component of components) {
    const Component = sanitizeComponent(component);
    if (Component.options.middlewares) {
      runMiddlewares = [...runMiddlewares, ...Component.options.middlewares];
    }
  }

  if (runMiddlewares.length) {
    for (const func of runMiddlewares) {
      if (typeof func === 'function') await func(middlwareContext);
    }
  }
};
