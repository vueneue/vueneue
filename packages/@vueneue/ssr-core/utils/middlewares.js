import { sanitizeComponent } from './asyncData';

export const handleMiddlewares = async (route, context) => {
  const { middlewares } = require('!../generated');

  const { router } = context;

  const middlwareContext = {
    ...context,
    route: router.currentRoute,
    params: router.currentRoute.params,
    query: router.currentRoute.query,
  };

  let runMiddlewares = [];

  // TODO: global middlewares
  // if (context.app.middlewares) {
  //   runMiddlewares = [...runMiddlewares, ...context.app.middlewares];
  // }

  const components = router.getMatchedComponents();
  for (const component of components) {
    const Component = sanitizeComponent(component);
    if (Component.options.middlewares) {
      runMiddlewares = [...runMiddlewares, ...Component.options.middlewares];
    }
  }

  if (runMiddlewares.length) {
    for (const name of runMiddlewares) {
      if (typeof middlewares[name] === 'function')
        await middlewares[name](middlwareContext);
    }
  }
};
