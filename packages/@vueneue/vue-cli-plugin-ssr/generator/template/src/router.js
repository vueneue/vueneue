import Router from 'vue-router';

export default () => {
  return new Router({
    mode: process.ssr ? 'history' : 'hash',
    routes: [
      {
        path: '/',
        name: 'home',
        component: () => import('./views/Home.vue'),
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('./views/About.vue'),
      },
    ],
  });
};
