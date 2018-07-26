const fs = require('fs-extra');
const webpack = require('webpack');
const formatStats = require('@vue/cli-service/lib/commands/build/formatStats');

const modifyConfig = (config, fn) => {
  if (Array.isArray(config)) {
    config.forEach(c => fn(c));
  } else {
    fn(config);
  }
};

module.exports = (api, options) => {
  api.registerCommand(
    'ssr:build',
    {
      description: 'build for production (SSR)',
      usage: 'vue-cli-service ssr:build [options]',
      options: {
        '--mode': `specify env mode (default: production)`,
        '--report': `generate report to help analyze bundle content`,
        '--watch': `watch for changes`,
      },
    },
    async function(args) {
      const clientConfig = api.neue.webpack.getConfig();
      const serverConfig = api.neue.webpack.getConfig({
        client: false,
      });

      await fs.remove(api.resolve(options.outputDir));

      // Expose advanced stats
      if (args.dashboard) {
        const DashboardPlugin = require('@vue/cli-service/lib/webpack/DashboardPlugin');
        modifyConfig(clientConfig, config => {
          config.plugins.push(
            new DashboardPlugin({
              type: 'ssr-build',
            }),
          );
        });
      }

      if (args.report || args['report-json']) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        modifyConfig(clientConfig, config => {
          config.plugins.push(
            new BundleAnalyzerPlugin({
              logLevel: 'warn',
              openAnalyzer: false,
              analyzerMode: args.report ? 'static' : 'disabled',
              reportFilename: `report.html`,
              statsFilename: `report.json`,
              generateStatsFile: true,
            }),
          );
        });
      }

      const compiler = webpack([clientConfig, serverConfig]);
      const onCompilationComplete = (err, stats) => {
        if (err) {
          // eslint-disable-next-line
          console.error(err);
          return;
        }
        // eslint-disable-next-line
        console.log(`\n` + formatStats(stats, options.outputDir, api));
      };

      if (args.watch) {
        compiler.watch({}, onCompilationComplete);
      } else {
        compiler.run(onCompilationComplete);
      }
    },
  );
};
