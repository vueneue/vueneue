import Vuex from 'vuex';

export default () => {
  return new Vuex.Store({
    state: {
      value: 'default',
      parent: 'default',
      httpRequest: 'default',
      middleware: 'default',
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
    },

    actions: {
      async onHttpRequest({ commit }) {
        commit('setHttpRequest', 'onHttpRequest');
      },
    },
  });
};
