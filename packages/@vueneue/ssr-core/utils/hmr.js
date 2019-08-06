import errorHandler from './errorHandler';
import { handleMiddlewares } from './middlewares';
import { applyAsyncData, sanitizeComponent } from './asyncData';
import { getContext } from './context';

const findAsyncDataComponents = (parent, components = []) => {
  for (const child of parent.$children) {
    if (child.$vnode && child.$vnode.data.routerView) {
      components.push(child);
    }
    if (child.$children.length) {
      findAsyncDataComponents(child, components);
    }
  }
  return components;
};

export const addHotReload = context => {
  if (!module.hot) return;

  const { app, router } = context;
  const components = findAsyncDataComponents(app);

  for (const depth in components) {
    const component = components[depth];
    const _forceUpdate = component.$forceUpdate.bind(component.$parent);

    component.$vnode.context.$forceUpdate = async () => {
      const routeComponents = router.getMatchedComponents(router.currentRoute);
      const Component = sanitizeComponent(routeComponents[depth]);

      try {
        if (Component && Component.options.asyncData) {
          const data = await Component.options.asyncData(getContext(context));
          applyAsyncData(Component, data);
        }
      } catch (err) {
        component.$error(err);
      }

      return _forceUpdate();
    };
  }
};

export const handleHMRMiddlewares = async context => {
  onHotReload(() => {
    handleMiddlewares(context).catch(error => errorHandler(context, { error }));
  });
};

const onHotReload = callback => {
  if (process.client && module.hot) {
    module.hot.addStatusHandler(status => {
      if (status === 'idle') callback();
    });
  }
};
