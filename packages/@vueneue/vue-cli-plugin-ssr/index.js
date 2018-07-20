const definePlugin = require('./webpack/definePlugin');
const NeueApi = require('./lib/NeueApi');

module.exports = api => {
  api.chainWebpack(config => {
    // Change main entry
    config.entryPoints
      .get('app')
      .clear()
      .add(require.resolve('@vueneue/ssr-core/client'));

    // Add alias to vueclass
    config.resolve.alias
      .set('neueclass', '@vueneue/ssr-core/neueclass.js')
      .set('neuets', '@vueneue/ssr-core/neuets.ts');
  });

  api.configureWebpack(() => {
    // Add required process vars for Vueneue (for SPA mode only)
    const defines = definePlugin();
    defines.__vueneue = true;

    return {
      plugins: [defines],
      module: {
        rules: [
          {
            test: /@vueneue(\/|\\)ssr-core(\/|\\)generated\.js/,
            enforce: 'pre',
            loader: '@vueneue/vue-cli-plugin-ssr/webpack/alterLoader.js',
            options: { api },
          },
        ],
      },
    };
  });

  api.service.projectOptions.transpileDependencies.push(/@vueneue\/ssr-core/);

  // Install neue API
  api.neue = new NeueApi(api);

  require('./commands/serve')(api, api.service.projectOptions);
  require('./commands/build')(api, api.service.projectOptions);
  require('./commands/start')(api, api.service.projectOptions);
  require('./commands/generate')(api, api.service.projectOptions);
};

module.exports.defaultModes = {
  'ssr:serve': 'development',
  'ssr:build': 'production',
  'ssr:start': 'production',
};
