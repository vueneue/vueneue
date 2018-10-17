import 'isomorphic-fetch';
import Vue from 'vue';
import VueApollo from 'vue-apollo';
import ApolloSSR from 'vue-apollo/ssr';
import App from '../App.vue';

if (!Vue.prototype.hasOwnProperty('$apollo')) {
  Vue.use(VueApollo);
}

if (process.server) {
  Vue.use(ApolloSSR);
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

export default async ({ appCreated }) => {
  if (process.server) {
    appCreated(app => {
      if (!app.$options.middlewares) {
        app.$options.middlewares = [];
      }

      app.$options.middlewares.push(
        async ({ app, router, route, store, ssr, error }) => {
          const matchedComponents = router.getMatchedComponents();

          try {
            await ApolloSSR.prefetchAll(
              app.$apolloProvider,
              [App, ...matchedComponents],
              {
                route,
                store,
              },
            );
            ssr.bodyAdd = `<script>window.__APOLLO_STATE__=${JSON.stringify(
              ApolloSSR.getStates(app.$apolloProvider),
            )}</script>`;
          } catch (err) {
            error(err);
          }
        },
      );
    });
  }
};
