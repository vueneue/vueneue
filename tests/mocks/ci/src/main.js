import './styles.css';
import Vue from 'vue';
import App from './App.vue';
import { global } from './middlewares';

Vue.config.productionTip = false;

export default ({ router, redirect, store }) => {
  router.beforeEach((to, from, next) => {
    if (/redirect-nav-guard/.test(to.path)) {
      redirect('/?redirect=true&from=beforeEach');
    }
    next();
  });

  return new Vue({
    router,
    store,
    middlewares: [global],
    render: h => h(App),
  });
};
