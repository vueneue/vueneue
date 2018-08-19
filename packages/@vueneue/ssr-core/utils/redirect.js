export default context => {
  return (location, statusCode = 301) => {
    const { app, router, ssr } = context;
    const redirectError = new Error('ROUTER_REDIRECT');

    if (process.client) {
      // Client side

      // Build set destination
      redirectError.href = router.resolve(location, router.currentRoute).href;
    } else {
      // Server side

      // Set status code
      ssr.redirected = statusCode;
      redirectError.statusCode = statusCode;

      // Resolve destination
      const routerResult = router.resolve(location, router.currentRoute);
      if (routerResult) {
        redirectError.href = routerResult.href;
      } else {
        redirectError.href = location;
      }
    }

    // Emit event
    app.$emit('router.redirect', { href: redirectError.href });

    throw redirectError;
  };
};
