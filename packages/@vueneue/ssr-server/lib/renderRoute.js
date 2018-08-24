const htmlBuilder = require('./htmlBuilder');
const spaRoute = require('./spaRoute');
const mm = require('micromatch');

module.exports = async (serverContext, ssrContext) => {
  const { ctx, spaPaths, renderer } = serverContext;

  ctx.set('content-type', 'text/html; charset=utf-8');

  // SPA route
  if (spaPaths && spaPaths.length && mm.some(ssrContext.url, spaPaths)) {
    ctx.body = spaRoute(serverContext);
    return ctx;
  }

  // SSR route
  try {
    const html = await renderer.renderToString(ssrContext);

    if (ssrContext.redirected) {
      ctx.status = ssrContext.redirected;
      return ctx;
    }

    const { errorHandler } = ssrContext.data.state;
    if (errorHandler.error) {
      ctx.status = errorHandler.statusCode || 500;
    } else {
      ctx.status = 200;
    }

    ctx.body = await htmlBuilder(serverContext, ssrContext, html);
    return ctx;

    // On error
  } catch (err) {
    ctx.status = 500;
    ctx.body = `Server error`;

    // eslint-disable-next-line
    console.error(err.stack || err);

    return ctx;
  }
};
