import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';
import NoSSR from 'vue-no-ssr';

/**
 * Base plugins
 */
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueMeta, {
  keyName: 'head',
});

/**
 * VueNeue helpers functions
 */
Vue.use({
  install(Vue) {
    Vue.prototype.$redirect = function(location) {
      this.$context.redirect(location);
    };
    Vue.prototype.$error = function(error, statusCode = 500) {
      this.$context.error(error, statusCode);
    };
  },
});

/**
 * No-SSR component
 */
Vue.component('no-ssr', NoSSR);
