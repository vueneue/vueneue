import Vuex from 'vuex';

export default () => {
  return new Vuex.Store({
    state: {
      value: 'default',
      parent: 'default',
      httpRequest: 'default',
      middleware: 'default',
      plugin: 'default',
      pluginAppCreated: 'no',
    },

    mutations: {
      setValue(state, value) {
        state.value = value;
      },
      setHttpRequest(state, value) {
        state.httpRequest = value;
      },
      setMiddleware(state, value) {
        state.middleware = value;
      },
      setParent(state, value) {
        state.parent = value;
      },
      setPlugin(state, value) {
        state.plugin = value;
      },
      setPluginAppCreated(state, value) {
        state.pluginAppCreated = value;
      },
    },

    actions: {
      async onHttpRequest({ commit }, { url }) {
        if (
          url === '/on-http-request-error' ||
          url === '/spa/on-http-request-error'
        ) {
          throw new Error('onHttpREquest error');
        }
        commit('setHttpRequest', 'onHttpRequest');
      },
    },
  });
};
