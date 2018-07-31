const NeueApi = require('@vueneue/ssr-core/build/NeueApi');

module.exports = api => {
  const { projectOptions } = api.service;

  // Install Neue API
  api.neue = new NeueApi(api);

  // Vue CLI commands
  require('./commands/serve')(api, projectOptions);
  require('./commands/build')(api, projectOptions);
  require('./commands/start')(api, projectOptions);
  require('./commands/generate')(api, projectOptions);
};

module.exports.defaultModes = {
  'ssr:serve': 'development',
  'ssr:build': 'production',
  'ssr:start': 'production',
};
