const htmlBuilder = require('./htmlBuilder');
const spaRoute = require('./spaRoute');
const mm = require('micromatch');

module.exports = (serverContext, ssrContext) => {
  return new Promise((resolve, reject) => {
    const { ctx, spaPaths } = serverContext;

    ctx.set('content-type', 'text/html');

    // SPA route
    if (spaPaths && spaPaths.length && mm.some(ssrContext.url, spaPaths)) {
      ctx.response.body = spaRoute(serverContext);
      return resolve(ctx);
    }

    // SSR route
    serverContext.renderer.renderToString(ssrContext, async (err, html) => {
      if (ssrContext.redirected) {
        ctx.response.status = ssrContext.redirected;
        return resolve(ctx);
      }

      if (err) {
        ctx.response.status = 500;
        ctx.response.body = `Whoops!`;

        // eslint-disable-next-line
        console.error(err.stack || err);

        return reject(ctx);
      }

      const { errorHandler } = ssrContext.state;
      if (errorHandler.error) {
        ctx.response.status = errorHandler.statusCode || 500;
      } else {
        ctx.response.status = 200;
      }

      ctx.response.body = await htmlBuilder(serverContext, ssrContext, html);
      resolve(ctx);
    });
  });
};
