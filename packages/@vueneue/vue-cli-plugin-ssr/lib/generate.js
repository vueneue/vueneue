const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const mm = require('micromatch');
const createRenderer = require('@vueneue/ssr-server/lib/createRenderer');
const renderRoute = require('@vueneue/ssr-server/lib/renderRoute');
const spaRoute = require('@vueneue/ssr-server/lib/spaRoute');
const Critters = require('@vueneue/critters');

const whiteBox = str => chalk.bgWhite(chalk.black(` ${str} `));
const greenBox = str => chalk.bgGreen(chalk.black(` ${str} `));
const yellowBox = str => chalk.bgYellow(chalk.black(` ${str} `));
const redBox = str => chalk.bgRed(chalk.black(` ${str} `));
const blueBox = str => chalk.bgBlue(chalk.black(` ${str} `));

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

  let templateSpa = '';
  if (fs.existsSync(`${options.outputDir}/index.spa.html`)) {
    templateSpa = fs.readFileSync(
      `${options.outputDir}/index.spa.html`,
      'utf-8',
    );
  }

  /**
   * Create renderer
   */
  const renderer = createRenderer(serverBundle, {
    clientManifest,
  });

  /**
   * Get project config
   */
  const generate = Object.assign(
    { scanRouter: true },
    api.neue.getConfig('generate') || {},
  );
  const spaPaths = api.neue.getConfig('spaPaths') || [];
  const css = api.neue.getConfig('css') || {};

  // Fake server context
  const serverContext = { css, renderer, template };

  // Critical CSS
  if (css.critical) {
    serverContext.critters = new Critters(css.critical);
    serverContext.cssFiles = clientManifest.all
      .filter(filepath => /\.css$/.test(filepath))
      .reduce((result, filepath) => {
        result[`/${filepath}`] = fs.readFileSync(
          path.join(options.outputDir, filepath),
          'utf-8',
        );
        return result;
      }, {});
  }

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

  // If scanRouter enabled
  if (generate.scanRouter) {
    const firstContext = await callRenderer({
      url: '/',
      ctx: createKoaContext(),
    });
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

  process.stdout.write(
    whiteBox(`Generating ${generate.paths.length} routes...`) + `\n`,
  );

  for (const pagePath of generate.paths) {
    await buildPage({
      options,
      pagePath,
      serverContext,
      templateSpa,
      spaPaths,
    });
  }

  // Parallel execution
  // await Promise.all(
  //   generate.paths.map(pagePath =>
  //     buildPage({
  //       options,
  //       pagePath,
  //       serverContext,
  //       templateSpa,
  //       spaPaths,
  //     }),
  //   ),
  // );

  await fs.remove(`${options.outputDir}/index.ssr.html`);
  await fs.remove(`${options.outputDir}/index.spa.html`);
};

const redirectPage = url => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=${url}" />
</head>
<body>Redirecting...</body>
</html>`;
};

const buildSSRPage = async ({
  options,
  serverContext,
  ssrContext,
  pagePath,
}) => {
  let routeCtx;
  try {
    routeCtx = await renderRoute(serverContext, ssrContext);
  } catch (err) {
    routeCtx = err;
  }

  const status = routeCtx.status;
  let body = routeCtx.body;

  if (status === 301 || status == 302) {
    body = redirectPage(body);
  }

  if (!/\.html?$/.test(pagePath)) {
    await fs.ensureDir(`${options.outputDir}/${pagePath}`);
    await fs.writeFileSync(`${options.outputDir}/${pagePath}/index.html`, body);
  } else {
    await fs.ensureDir(`${options.outputDir}/${path.dirname(pagePath)}`);
    await fs.writeFileSync(`${options.outputDir}/${pagePath}`, body);
  }

  return status;
};

const buildSPAPage = async ({ templateSpa, options, pagePath }) => {
  await fs.ensureDir(`${options.outputDir}/${pagePath}`);
  await fs.writeFileSync(
    `${options.outputDir}/${pagePath}/index.html`,
    spaRoute({ templateSpa }),
  );
  return 'SPA';
};

const buildPage = async ({
  serverContext,
  templateSpa,
  options,
  pagePath,
  spaPaths,
}) => {
  const ctx = createKoaContext();
  const ssrContext = { url: pagePath, ctx };
  const before = new Date().getTime();

  let status = null;

  // SPA route
  if (templateSpa && spaPaths.length && mm.some(ssrContext.url, spaPaths)) {
    status = await buildSPAPage({ templateSpa, options, pagePath });

    // SSR route
  } else {
    serverContext = { ...serverContext, ctx };
    status = await buildSSRPage({
      options,
      serverContext,
      ssrContext,
      pagePath,
    });
  }

  const generateTime = new Date().getTime() - before;

  let boxFunc = greenBox;
  if (status === 'SPA') {
    boxFunc = blueBox;
  } else if (status >= 300 && status < 400) {
    boxFunc = yellowBox;
  } else if (status >= 400) {
    boxFunc = redBox;
  }

  process.stdout.write(`${boxFunc(status)}\t${generateTime}ms\t${pagePath}\n`);
};

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
