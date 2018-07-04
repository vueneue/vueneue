import { resolveComponentsAsyncData } from './asyncData';
import errorHandler from './errorHandler';
import { handleMiddlewares } from './middlewares';

let hmrInstalled = false;
export const handleHMRAsyncData = context => {
  if (hmrInstalled) return;
  hmrInstalled = true;

  onHotReload(() => {
    const { router, store } = context;
    const route = router.currentRoute;
    const matched = router.getMatchedComponents();

    // Get data
    resolveComponentsAsyncData(route, matched, context)
      .then(datas => {
        // Get instances with asyncData
        const instances = [];
        for (const match of router.currentRoute.matched) {
          if (match.components.default && match.components.default.asyncData) {
            instances.push(match.instances.default);
          }
        }

        // Set data on components
        for (const index in datas) {
          const data = datas[index];
          const instance = instances[index];
          if (instance) Object.assign(instance.$data, data);
        }
      })
      .then(() => {
        store.commit('errorHandler/CLEAR');
      })
      .catch(error => {
        errorHandler(context, { error });
      });
  });
};

export const handleHMRMiddlewares = async context => {
  onHotReload(() => {
    handleMiddlewares(context.router.currentRoute, context).catch(error =>
      errorHandler(context, { error }),
    );
  });
};

const onHotReload = callback => {
  if (process.client && module.hot) {
    module.hot.addStatusHandler(status => {
      if (status === 'idle') callback();
    });
  }
};
