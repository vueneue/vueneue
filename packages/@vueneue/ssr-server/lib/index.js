const { readFileSync } = require('fs-extra');
const { join } = require('path');
const Koa = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');

const createRenderer = require('./createRenderer');
const renderRoute = require('./renderRoute');

module.exports = async opts => {
  const { api, host, port, ssr } = opts;
  const options = api.service.projectOptions;

  const app = new Koa();
  const isProduction = process.env.NODE_ENV === 'production';
  const serverContext = { ...opts, app };
  const distPath = api.resolve(options.outputDir);

  let readyPromise;
  if (isProduction) {
    const serverBundle = require(join(distPath, 'server-bundle.json'));
    const clientManifest = require(join(distPath, 'client-manifest.json'));
    serverContext.renderer = createRenderer(serverBundle, {
      clientManifest,
      directives: ssr ? ssr.directives : undefined,
    });
    readyPromise = Promise.resolve();
  } else {
    readyPromise = require('./devMiddleware')(
      serverContext,
      (bundle, options) => {
        serverContext.renderer = createRenderer(bundle, {
          ...options,
          directives: ssr ? ssr.directives : undefined,
        });
      },
    );
  }

  await readyPromise;

  /**
   * Server
   */
  if (isProduction) {
    // In production mode get index.ssr.html file content
    serverContext.template = readFileSync(
      join(distPath, 'index.ssr.html'),
      'utf-8',
    );

    // Add middlewares on Koa
    app.use(mount('/', serve(distPath)));
  }

  // Server customization
  if (ssr && typeof ssr.server === 'function') {
    ssr.server(app);
  }

  app.use(ctx => {
    const { url } = ctx;
    const ssrContext = { url, ctx };

    serverContext.ctx = ctx;

    if (isProduction) {
      return renderRoute(serverContext, ssrContext);
    } else {
      return readyPromise.then(() => renderRoute(serverContext, ssrContext));
    }
  });

  const instance = app.listen(port, host, () => {
    // eslint-disable-next-line
    console.log(`Server started at http://${host}:${port}`);
  });

  return instance;
};
