const path = require('path');
const webpack = require('webpack');
const MFS = require('memory-fs');
const koaWebpack = require('koa-webpack');

module.exports = function setupDevServer(serverContext, callback) {
  const { app, configs, host } = serverContext;
  const { client, server } = configs;

  let serverBundle;
  let clientManifest;

  let resolve;
  let resolved = false;

  const readyPromise = new Promise(r => {
    resolve = r;
  });

  const ready = (...args) => {
    if (!resolved) resolve();
    resolved = true;
    callback(...args);
  };

  // Config for dev middleware
  // client.entry = [client.entry];
  client.output.filename = '[name].js';
  client.plugins.push(new webpack.NoEmitOnErrorsPlugin());

  const mfs = new MFS();
  const compiler = webpack([client, server]);
  compiler.outputFileSystem = mfs;

  // Add middleware to app
  koaWebpack({
    compiler: compiler.compilers[0],
    hotClient: {
      host,
      logLevel: 'warn',
    },
    devMiddleware: {
      serverSideRender: true,
      publicPath: client.output.publicPath,
      quiet: true,
      noInfo: true,
      stats: false,
      logLevel: 'warn',
    },
  }).then(middleware => {
    app.use(middleware);

    const handleCompilation = () => {
      serverContext.template = readFile('index.ssr.html');
      clientManifest = JSON.parse(readFile('client-manifest.json'));
      serverBundle = JSON.parse(readFile('server-bundle.json'));

      if (clientManifest && serverBundle) {
        ready(serverBundle, { clientManifest });
      }
    };

    compiler.hooks.done.tap('WebapackClientDev', handleCompilation);

    const readFile = file => {
      try {
        return mfs.readFileSync(path.join(client.output.path, file), 'utf-8');
      } catch (err) {
        return 'null';
      }
    };

    compiler.compilers[1].watch({}, (err, stats) => {
      if (err) throw err;

      stats = stats.toJson();
      // eslint-disable-next-line
      stats.errors.forEach(err => console.error(err));
      // eslint-disable-next-line
      stats.warnings.forEach(err => console.warn(err));

      handleCompilation();
    });
  });

  return readyPromise;
};
