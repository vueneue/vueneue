import 'isomorphic-fetch';
import Vue from 'vue';
import VueApollo from 'vue-apollo';

if (!Vue.prototype.hasOwnProperty('$apollo')) {
  Vue.use(VueApollo);
}

export const getAuth = (AUTH_TOKEN, ctx) => {
  return () => {
    if (process.client) {
      return 'Bearer ' + require('js-cookie').get(AUTH_TOKEN);
    } else {
      if (ctx && ctx.cookie) {
        return 'Bearer ' + ctx.cookie[AUTH_TOKEN];
      }
    }
  };
};

export default async ({ app }) => {
  if (process.server) {
    const apolloProvider = app._provided.$apolloProvider;
    if (!app.$options.middlewares) {
      app.$options.middlewares = [];
    }

    app.$options.middlewares.push(async ({ router, ssr, error }) => {
      const matchedComponents = router.getMatchedComponents();

      try {
        await apolloProvider.prefetchAll(
          { route: router.currentRoute },
          matchedComponents,
        );
        ssr.bodyAdd = `<script>window.__APOLLO_STATE__=${JSON.stringify(
          apolloProvider.getStates(),
        )}</script>`;
      } catch (err) {
        error(err);
      }
    });
  }
};
