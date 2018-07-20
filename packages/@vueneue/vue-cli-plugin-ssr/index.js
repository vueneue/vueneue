const definePlugin = require('./webpack/definePlugin');
const NeueApi = require('@vueneue/ssr-core/webpack/NeueApi');
const NeueCorePlugin = require('@vueneue/ssr-core/webpack/NeueCorePlugin');

module.exports = api => {
  // Install neue API
  api.neue = new NeueApi(api);

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

    // Add NeueCorePlugin
    config.plugin('neue-core').use(NeueCorePlugin, [{ api }]);
  });

  api.configureWebpack(() => {
    // Add required process vars for Vueneue (for SPA mode only)
    const defines = definePlugin();
    defines.__vueneue = true;

    return {
      plugins: [defines],
    };
  });

  // ssr-core need to be transpiled
  api.service.projectOptions.transpileDependencies.push(/@vueneue\/ssr-core/);

  // Vue CLI commands
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
