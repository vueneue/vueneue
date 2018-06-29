const htmlBuilder = require('./htmlBuilder');

module.exports = (serverContext, ssrContext) => {
  return new Promise((resolve, reject) => {
    const { ctx } = serverContext;

    ctx.set('content-type', 'text/html');
    serverContext.renderer.renderToString(ssrContext, async (err, html) => {
      if (ssrContext.redirected) {
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
