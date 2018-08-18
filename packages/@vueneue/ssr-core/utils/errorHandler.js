import Vue from 'vue';

export default (context, data) => {
  const { error, info, vm } = data;
  const { store, router } = context;

  if (process.client) {
    if (process.env.NODE_ENV !== 'production') {
      Vue.util.warn(`Error in ${info}: "${error.toString()}"`, vm);
    } else if (process.env.VUE_APP_ENABLE_ERROR_LOGS) {
      // eslint-disable-next-line
      console.error(error.stack || error.message || error);
    }
  }

  if (!data.statusCode) data.statusCode = 500;
  data.route = { ...router.currentRoute };
  data.route.matched = undefined;

  store.commit('errorHandler/SET', data);
};
