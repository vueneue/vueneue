const { readFileSync, existsSync } = require('fs-extra');
const { join } = require('path');
const Koa = require('koa');
const mount = require('koa-mount');
const serve = require('koa-static');
const Critters = require('@vueneue/critters');

const createRenderer = require('./createRenderer');
const renderRoute = require('./renderRoute');

module.exports = async opts => {
  const { dist, host, port, ssr, css } = opts;

  const app = new Koa();
  const isProduction = process.env.NODE_ENV === 'production';
  const serverContext = { ...opts, app };

  let readyPromise;
  if (isProduction) {
    const serverBundle = require(join(dist, 'server-bundle.json'));
    const clientManifest = require(join(dist, 'client-manifest.json'));
    serverContext.clientManifest = clientManifest;
    serverContext.renderer = createRenderer(serverBundle, {
      clientManifest,
      directives: ssr ? ssr.directives : undefined,

    // Critical CSS: fetch all css files
    if (css && css.critical) {
      css.critters = new Critters({
        style: false, // vue-style-loader handle inline component style already
      });

      css.files = clientManifest.all
        .filter(filepath => /\.css$/.test(filepath))
        .reduce((result, filepath) => {
          result[`/${filepath}`] = readFileSync(join(dist, filepath), 'utf-8');
          return result;
        }, {});
    }

    readyPromise = Promise.resolve();
  } else {
    readyPromise = require('./devMiddleware')(
      serverContext,
      (bundle, { clientManifest }) => {
        serverContext.clientManifest = clientManifest;
        serverContext.renderer = createRenderer(bundle, {
          clientManifest,
          directives: ssr ? ssr.directives : undefined,
          shouldPreload: ssr ? ssr.shouldPreload : undefined,
          shouldPrefetch: ssr ? ssr.shouldPrefetch : undefined,
        });
      },
    );
  }

  await readyPromise;

  // Server customization
  if (ssr && typeof ssr.server === 'function') {
    ssr.server(app);
  }

  // In production mode
  if (isProduction) {
    // Use index.ssr.html file for routes templates
    serverContext.template = readFileSync(
      join(dist, 'index.ssr.html'),
      'utf-8',
    );

    if (existsSync(join(dist, 'index.spa.html'))) {
      serverContext.templateSpa = readFileSync(
        join(dist, 'index.spa.html'),
        'utf-8',
      );
    }

    // Serve static files
    app.use(mount('/', serve(dist)));
  }

  // Main middleware: render routes
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

  let httpServer;

  const { https } = ssr || {};
  if (https && https.key && https.cert) {
    httpServer = require('https').createServer(https, app.callback());
  } else {
    httpServer = require('http').createServer(app.callback());
  }

  httpServer.listen(port, host);

  app.httpServer = httpServer;

  return httpServer;
};
