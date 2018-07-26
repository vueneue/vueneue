const { IpcMessenger } = require('@vue/cli-shared-utils');

const defaults = {
  host: '127.0.0.1',
  port: 8080,
};

const modifyConfig = (config, fn) => {
  if (Array.isArray(config)) {
    config.forEach(c => fn(c));
  } else {
    fn(config);
  }
};

module.exports = (api, options) => {
  api.registerCommand(
    'ssr:serve',
    {
      description: 'start development server (SSR)',
      usage: 'vue-cli-service ssr:serve [options]',
      options: {
        '--mode': `specify env mode (default: development)`,
        '--host': `specify host (default: ${defaults.host})`,
        '--port': `specify port (default: ${defaults.port})`,
      },
    },
    async function(args) {
      const projectDevServerOptions = options.devServer || {};

      const portfinder = require('portfinder');
      const startServer = require('@vueneue/ssr-server');

      const host =
        args.host ||
        process.env.HOST ||
        projectDevServerOptions.host ||
        defaults.host;
      portfinder.basePort =
        args.port ||
        process.env.PORT ||
        projectDevServerOptions.port ||
        defaults.port;

      const port = await portfinder.getPortPromise();

      const clientConfig = api.neue.webpack.getConfig({
        host,
        port,
      });
      const serverConfig = api.neue.webpack.getConfig({
        client: false,
        host,
        port,
      });

      // Expose advanced stats
      if (args.dashboard) {
        const DashboardPlugin = require('@vue/cli-service/lib/webpack/DashboardPlugin');
        modifyConfig(clientConfig, config => {
          config.plugins.push(
            new DashboardPlugin({
              type: 'ssr-serve',
            }),
          );
        });
      }

      const { ssr, spaPaths } = api.neue.getConfig();

      await startServer({
        host,
        port,
        dist: api.resolve(options.outputDir),
        ssr,
        spaPaths,
        configs: {
          client: clientConfig,
          server: serverConfig,
        },
      });

      if (args.dashboard) {
        // Send final app URL
        const ipc = new IpcMessenger();
        ipc.connect();
        ipc.send({
          vueServe: {
            url: `http://${host}:${port}`,
          },
        });
      }
    },
  );
};
