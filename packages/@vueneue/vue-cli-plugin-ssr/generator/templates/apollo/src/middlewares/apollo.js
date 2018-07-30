import 'isomorphic-fetch';

export default async ({ app, router, error, ssr }) => {
  const apolloProvider = app._provided.$apolloProvider;

  router.onReady(() => {
    const matchedComponents = router.getMatchedComponents();

    apolloProvider
      .prefetchAll({ route: router.currentRoute }, matchedComponents)
      .then(() => {
        if (ssr) {
          ssr.apolloState = apolloProvider.getStates();
        }
      })
      .catch(err => {
        error(err);
      });
  });
};
