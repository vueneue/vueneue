import middlewares from '@/middlewares';

export const handleMiddlewares = async (route, context) => {
  const middlwareContext = {
    ...context,
    route: context.router.currentRoute,
    params: context.router.currentRoute.params,
    query: context.router.currentRoute.query,
  };

  if (middlewares) {
    for (const func of middlewares) {
      await func(middlwareContext);
    }
  }

  let routeMiddlewares = [];
  for (const match of route.matched) {
    if (match.meta.middlewares)
      routeMiddlewares = [...routeMiddlewares, ...match.meta.middlewares];
  }

  if (routeMiddlewares.length) {
    for (const func of routeMiddlewares) {
      await func(middlwareContext);
    }
  }
};
