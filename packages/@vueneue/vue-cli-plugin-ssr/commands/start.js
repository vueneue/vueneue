const fs = require('fs-extra');
const { join } = require('path');

const defaults = {
  host: '0.0.0.0',
  port: 8080,
};

const existsSync = filepath => {
  if (!fs.existsSync(filepath)) throw new Error(`${filepath} doesnt exists`);
};

module.exports = (api, options) => {
  api.registerCommand(
    'ssr:start',
    {
      description: 'start production server (SSR)',
      usage: 'vue-cli-service ssr:start [options]',
      options: {
        '--host': `specify host (default: ${defaults.host})`,
        '--port': `specify port (default: ${defaults.port})`,
      },
    },
    async function(args) {
      try {
        existsSync(api.resolve(join(options.outputDir, 'server-bundle.json')));
        existsSync(
          api.resolve(join(options.outputDir, 'client-manifest.json')),
        );
        existsSync(api.resolve(join(options.outputDir, 'index.ssr.html')));
      } catch (err) {
        // eslint-disable-next-line
        console.error(
          'Incorrect SSR build, did you run "npm run ssr:build" before ?',
        );
        process.exit(1);
      }
      const startServer = require('@vueneue/ssr-server');

      const host = args.host || process.env.HOST || defaults.host;

      const portfinder = require('portfinder');
      portfinder.basePort = args.port || process.env.PORT || defaults.port;

      const port = await portfinder.getPortPromise();

      // Force production mode
      process.env.NODE_ENV = 'production';

      const { ssr } = api.neue.getConfig();

      startServer({
        host,
        port,
        dist: api.resolve(options.outputDir),
        ssr,
      });
    },
  );
};
