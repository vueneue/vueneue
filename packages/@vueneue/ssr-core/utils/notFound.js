const NotFoundComponent = {
  asyncData({ error }) {
    error(new Error('Page not found'), 404);
  },
  render: h => h('div'),
};

export default router => {
  router.addRoutes([
    {
      path: '*',
      name: 'pageNotFound',
      component: NotFoundComponent,
    },
  ]);
};
