import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueMeta from 'vue-meta';
import NoSSR from 'vue-no-ssr';
import { doRedirect } from './redirect';

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
    Vue.prototype.$error = function(error, statusCode = 500) {
      this.$context.error(error, statusCode);
    };
    Vue.prototype.$redirect = function(location, statusCode = 301) {
      doRedirect(this.$context, {
        href: location,
        statusCode,
      });
    };
  },
});

/**
 * No-SSR component
 */
Vue.component('no-ssr', NoSSR);
