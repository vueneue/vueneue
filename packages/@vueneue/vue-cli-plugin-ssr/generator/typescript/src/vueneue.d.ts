import Vue from 'vue';
import { Store } from 'vuex';
import VueRouter, { Route } from 'vue-router';
import { MetaInfo } from 'vue-meta';

/**
 * Vue meta
 */
declare module 'vue/types/vue' {
  interface Vue {
    head?: MetaInfo | (() => MetaInfo);
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    head?: MetaInfo | (() => MetaInfo);
  }
}

/**
 * VueNeue
 */
declare module 'vue/types/vue' {
  interface Vue {
    $error: (error: any, statusCode?: number) => void;
    $redirect: (location: any) => void;
    $context: {
      app: Vue;
      router: VueRouter;
      store: Store<any>;
      url: string;
      route: Route;
      query: any;
      params: any;
      reditect: (location: any) => void;
      error: (error: any, statusCode?: number) => void;
    };
  }
}
