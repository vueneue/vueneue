const deepClone = require('lodash/cloneDeep');
const merge = require('lodash/merge');
const get = require('lodash/get');
const path = require('path');
const fs = require('fs-extra');

const defaultConfig = {
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
};

class NeueApi {
  constructor(api) {
    this.api = api;
  }

  getConfig(selector) {
    let config = deepClone(defaultConfig);

    // Load config in project if exists
    if (fs.existsSync(this.api.resolve('neue.config.js'))) {
      config = merge(config, require(this.api.resolve('neue.config.js')));
    }

    // Plugins
    for (const pluginName in config.plugins) {
      if (typeof config[pluginName] === 'string') {
        config[pluginName] = { src: config[pluginName] };
      }
    }

    if (selector) {
      return get(config, selector);
    }
    return config;
  }

  getProjectPath() {
    return this.api.service.context;
  }

  async getFilePath(filepath) {
    const extensions = ['js', 'ts'];
    if (/^\./.test(filepath)) {
      filepath = path.join(this.getProjectPath(), filepath);

      // If no extensions, try to resolve it
      if (!path.extname(filepath)) {
        for (const ext of extensions) {
          if (await fs.exists(filepath + '.' + ext)) {
            filepath += '.' + ext;
            break;
          }
        }
      }
    }
    return filepath;
  }
}

module.exports = NeueApi;
