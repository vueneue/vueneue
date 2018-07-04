export default {
  namespaced: true,
  state: () => ({ error: null, statusCode: null, route: null }),
  mutations: {
    SET(state, value) {
      let { error, statusCode, route } = value;
      if (error instanceof Error) {
        state.error = {
          message: error.message,
          stack: error.stack,
          original: error,
        };
      } else {
        state.error = error;
      }
      state.statusCode = statusCode;
      state.route = route;
    },
    CLEAR(state) {
      state.error = state.statusCode = state.route = null;
    },
  },
};
