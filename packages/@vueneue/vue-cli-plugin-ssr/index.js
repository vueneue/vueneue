const webpack = require('webpack');
const NeueApi = require('@vueneue/ssr-core/build/NeueApi');
const NeueCorePlugin = require('@vueneue/ssr-core/build/NeueCorePlugin');

module.exports = api => {
  // Install neue API
  api.neue = new NeueApi(api);

  /**
   * Basic webpack conf for Neue
   */
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

    // Add DefinePlugin
    config
      .plugin('neue-define')
      .use(webpack.DefinePlugin, [api.neue.webpack.getDefine()]);
  });

  // ssr-core need to be transpiled
  api.service.projectOptions.transpileDependencies.push(/@vueneue\/ssr-core/);

  // Apollo whitelists
  if (api.hasPlugin('apollo')) {
    api.neue.webpack.nodeExternalsWhitelist.push(/vue-apollo/);
    api.neue.webpack.nodeExternalsWhitelist.push(/vue-cli-plugin-apollo/);
  }

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
