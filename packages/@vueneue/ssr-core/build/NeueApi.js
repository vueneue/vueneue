const deepClone = require('lodash/cloneDeep');
const merge = require('lodash/merge');
const get = require('lodash/get');
const path = require('path');
const fs = require('fs-extra');
const NeueWebpack = require('./NeueWebpack');

/**
 * Default config
 */
const defaultConfig = {
  ssr: {
    directives: {},
    server: null,
  },
  spaPaths: null,
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

/**
 * Neue API to work with Vue CLI and Webpack
 */
class NeueApi {
  constructor(api) {
    this.api = api;
    this.webpack = new NeueWebpack(this);
  }

  getConfig(selector) {
    let config = deepClone(defaultConfig);

    // Load config in project if exists
    const configPath = this.api.resolve('neue.config.js');
    if (fs.existsSync(configPath)) {
      config = merge(config, require(configPath));
      delete require.cache[configPath];
    }

    // Plugins
    for (const pluginName in config.plugins) {
      if (typeof config.plugins[pluginName] === 'string') {
        config.plugins[pluginName] = {
          src: config.plugins[pluginName],
          ssr: true,
        };
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
