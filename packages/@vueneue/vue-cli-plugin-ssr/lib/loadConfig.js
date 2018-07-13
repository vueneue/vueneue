const path = require('path');
const fs = require('fs-extra');
const merge = require('lodash/merge');

module.exports = api => {
  // Default config
  api.neue = {
    ssr: {
      directives: {},
      server: null,
    },
    generate: {
      scanRouter: true,
      params: {},
      paths: [],
    },
    templatePath: 'src/index.html',
    paths: {
      main: '@/main',
      store: '@/store',
      router: '@/router',
    },
    plugins: {},
    middlewares: {},
  };

  // Defaults paths to replace
  api.neue.defaultPaths = merge({}, api.neue.paths);

  // Load config in project if exists
  if (fs.existsSync(api.resolve('neue.config.js'))) {
    api.neue = merge(api.neue, require(api.resolve('neue.config.js')));
  }

  const extensions = ['js', 'ts'];

  for (const pathName in api.neue.paths) {
    let pathDest = api.neue.paths[pathName];

    if (/^\./.test(pathDest)) {
      pathDest = path.join(api.service.context, pathDest);

      // If no extensions, try to resolve it
      if (!path.extname(pathDest)) {
        for (const ext of extensions) {
          if (fs.existsSync(pathDest + '.' + ext)) {
            pathDest += '.' + ext;
            break;
          }
        }
      }

      if (!fs.existsSync(pathDest)) {
        throw new Error(
          `Unable to find ${pathDest} file for your config "${pathName}" in neue.config.js`,
        );
      }
    }

    // Plugins
    for (const pluginName in api.neue.plugins) {
      if (typeof api.neue.plugins[pluginName] === 'string') {
        api.neue.plugins[pluginName] = { src: api.neue.plugins[pluginName] };
      }
    }

    api.neue.paths[pathName] = pathDest;
  }
};
