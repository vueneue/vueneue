export const getRedirect = context => {
  return (location, statusCode = 301) => {
    const redirectError = new Error('ROUTER_REDIRECT');

    if (process.client) {
      // Client side

      // Build set destination
      redirectError.href = location;
    } else {
      // Server side

      // Set status code
      context.ssr.redirected = redirectError.statusCode = statusCode;

      // Resolve destination
      redirectError.href = location;
    }

    // Emit event
    if (context.app)
      context.app.$emit('router.redirect', { href: redirectError.href });

    throw redirectError;
  };
};

export const doRedirect = ({ ctx, ssr, router }, { href, statusCode }) => {
  if (process.client) {
    router.replace(href);
  } else {
    if (typeof href === 'object') {
      href = router.resolve(href, router.currentRoute).href;
    }

    ssr.redirected = ctx.status = statusCode || 301;
    ctx.redirect(href);
  }
};
