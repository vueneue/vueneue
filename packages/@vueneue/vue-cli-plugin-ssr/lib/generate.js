const fs = require('fs-extra');
const chalk = require('chalk');
const mm = require('micromatch');
const createRenderer = require('@vueneue/ssr-server/lib/createRenderer');
const renderRoute = require('@vueneue/ssr-server/lib/renderRoute');
const spaRoute = require('@vueneue/ssr-server/lib/spaRoute');

const whiteBox = str => chalk.bgWhite(chalk.black(` ${str} `));
const greenBox = str => chalk.bgGreen(chalk.black(` ${str} `));
const yellowBox = str => chalk.bgYellow(chalk.black(` ${str} `));
const redBox = str => chalk.bgRed(chalk.black(` ${str} `));

module.exports = async (api, options) => {
  /**
   * Get webpack generated files
   */
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
  const templateSpa = fs.readFileSync(
    `${options.outputDir}/index.spa.html`,
    'utf-8',
  );

  /**
   * Get project config
   */
  const generate = Object.assign(
    { scanRouter: true },
    api.neue.getConfig('generate') || {},
  );
  const spaPaths = api.neue.getConfig('spaPaths') || [];

  /**
   * Create a fake Koa context
   */
  const createKoaContext = () => ({
    set: () => null,
    status: null,
    body: null,
    redirect: function(location) {
      this.body = location;
    },
  });

  /**
   * Create renderer
   */
  const renderer = createRenderer(serverBundle, {
    clientManifest,
  });

  /**
   * Render a page
   */
  const callRenderer = context => {
    return new Promise((resolve, reject) => {
      renderer.renderToString(context, async err => {
        if (err) reject(err);
        resolve(context);
      });
    });
  };

  /**
   * Return all routes paths defined in application router
   */
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

  // Create koa context
  const ctx = createKoaContext();

  // If scanRouter enabled
  if (generate.scanRouter) {
    const firstContext = await callRenderer({ url: '/', ctx });
    const routes = firstContext.router.options.routes;
    generate.paths = getRoutesPaths(routes);
  }

  // Dedupe array
  generate.paths = [...new Set(generate.paths)];

  // Generate all possible paths with defined params
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

  // Fake server context
  const serverContext = {
    renderer,
    template,
    ctx,
  };

  process.stdout.write(
    whiteBox(`Generating ${generate.paths.length} routes...`) + `\n`,
  );

  let count = 0;
  for (const pagePath of generate.paths) {
    const ssrContext = { url: pagePath, ctx };
    const before = new Date().getTime();

    let body,
      status = null;

    // SPA route
    if (spaPaths.length && mm.some(ssrContext.url, spaPaths)) {
      status = 200;

      await fs.ensureDir(`${options.outputDir}/${pagePath}`);
      await fs.writeFileSync(
        `${options.outputDir}/${pagePath}/index.html`,
        spaRoute({ templateSpa }),
      );

      // SSR route
    } else {
      let routeCtx;
      try {
        routeCtx = await renderRoute(serverContext, ssrContext);
      } catch (err) {
        routeCtx = err;
      }

      status = routeCtx.status;
      body = routeCtx.body;

      if (status === 301 || status == 302) {
        body = `<!DOCTYPE html>
      <html>
      <head>
        <meta http-equiv="refresh" content="0; url=${body}" />
      </head>
      <body>Redirecting...</body>
      </html>`;
      }

      await fs.ensureDir(`${options.outputDir}/${pagePath}`);
      await fs.writeFileSync(
        `${options.outputDir}/${pagePath}/index.html`,
        body,
      );
    }

    count++;
    const generateTime = new Date().getTime() - before;

    let boxFunc = greenBox;
    if (status >= 300 && status < 400) {
      boxFunc = yellowBox;
    } else if (status >= 400) {
      boxFunc = redBox;
    }

    process.stdout.write(
      `${boxFunc(status)}\t${generateTime}ms\t${count}/${
        generate.paths.length
      }\t${pagePath}\n`,
    );
  }

  await fs.remove(`${options.outputDir}/index.ssr.html`);
  await fs.remove(`${options.outputDir}/index.spa.html`);
};
