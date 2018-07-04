const fs = require('fs-extra');
const createRenderer = require('@vueneue/ssr-server/lib/createRenderer');
const renderRoute = require('@vueneue/ssr-server/lib/renderRoute');

module.exports = async (api, options) => {
  const serverBundle = JSON.parse(
    fs.readFileSync(`${options.outputDir}/server-bundle.json`, 'utf-8'),
  );
  const clientManifest = JSON.parse(
    fs.readFileSync(`${options.outputDir}/client-manifest.json`, 'utf-8'),
  );
  const template = fs.readFileSync(
    `${options.outputDir}/index.ssr.html`,
    'utf-8',
  );

  const { generate } = options.pluginOptions;

  // Fake koa context
  const createKoaContext = () => ({
    set: () => null,
    response: {
      status: null,
      body: null,
    },
    redirect: function(location) {
      this.response.body = location;
    },
  });

  const renderer = createRenderer(serverBundle, {
    clientManifest,
  });

  const callRenderer = context => {
    return new Promise((resolve, reject) => {
      renderer.renderToString(context, async err => {
        if (err) reject(err);
        resolve(context);
      });
    });
  };

  const getRoutesPaths = (routes, parentPath = '') => {
    let results = [];

    for (const route of routes) {
      let routePath = /^\//.test(route.path)
        ? route.path
        : `${parentPath}/${route.path}`;

      if (route.path === '*' && parentPath === '') routePath = '/404';

      const finalPath = routePath.replace(/.+\/$/, '');
      if (finalPath !== '') results.push(finalPath);

      if (route.children) {
        results = [...results, ...getRoutesPaths(route.children, routePath)];
      }
    }

    return results;
  };

  const ctx = createKoaContext();

  if (generate.scanRouter) {
    const firstContext = await callRenderer({ url: '/', ctx });
    const routes = firstContext.router.options.routes;
    generate.paths = getRoutesPaths(routes);
  }

  // Dedupe array
  generate.paths = [...new Set(generate.paths)];

  if (generate.params) {
    for (const paramName in generate.params) {
      const paramValues = generate.params[paramName];
      const newPaths = [];

      generate.paths.forEach(pagePath => {
        const regexp = new RegExp(`/:${paramName}`);
        if (regexp.exec(pagePath)) {
          for (const value of paramValues) {
            const finalPath = pagePath.replace(
              regexp,
              value ? `/${value}` : '',
            );
            if (finalPath !== '') newPaths.push(finalPath);
          }
        } else {
          newPaths.push(pagePath);
        }
      });

      generate.paths = [...newPaths];
    }
  }

  const serverContext = {
    renderer,
    template,
    ctx,
  };

  for (const pagePath of generate.paths) {
    // eslint-disable-next-line
    console.log(`${pagePath}`);

    const ssrContext = { url: pagePath, ctx };

    let response;
    try {
      response = (await renderRoute(serverContext, ssrContext)).response;
    } catch (err) {
      response = err.response;
    }

    await fs.ensureDir(`${options.outputDir}/${pagePath}`);
    await fs.writeFileSync(
      `${options.outputDir}/${pagePath}/index.html`,
      response.body,
    );
  }

  await fs.remove(`${options.outputDir}/index.ssr.html`);
};
