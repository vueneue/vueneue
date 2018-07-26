const fs = require('fs-extra');
const webpack = require('webpack');
const formatStats = require('@vue/cli-service/lib/commands/build/formatStats');
const generate = require('../lib/generate');

module.exports = (api, options) => {
  api.registerCommand(
    'generate',
    {
      description: 'generate static files',
      usage: 'vue-cli-service generate',
    },
    async function() {
      // Force production mode
      process.env.NODE_ENV = 'production';

      const clientConfig = api.neue.webpack.getConfig();
      const serverConfig = api.neue.webpack.getConfig({
        client: false,
      });

      await fs.remove(api.resolve(options.outputDir));

      const compiler = webpack([clientConfig, serverConfig]);
      const onCompilationComplete = async (err, stats) => {
        if (err) {
          // eslint-disable-next-line
          console.error(err);
          return;
        }
        // eslint-disable-next-line
        console.log(formatStats(stats, options.outputDir, api));

        try {
          await generate(api, options);
        } catch (err) {
          // eslint-disable-next-line
          console.error(err);
        }
      };

      compiler.run(onCompilationComplete);
    },
  );
};
