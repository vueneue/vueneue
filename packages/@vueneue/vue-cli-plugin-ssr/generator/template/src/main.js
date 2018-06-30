import Vue from 'vue';
import App from '@/App.vue';

/**
 * Create application
 */
export function createApp({ router, store }) {
  return new Vue({
    router,
    store,
    render: h => h(App),
  });
}

/**
 * Init callback
 */
export async function initApp() {}
