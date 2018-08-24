const merge = require('lodash/merge');
const get = require('lodash/get');
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const NeueCorePlugin = require('./NeueCorePlugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const nodeExternals = require('webpack-node-externals');
const WebpackBar = require('webpackbar');
const HtmlWebpack = require('html-webpack-plugin');

/**
 * Default config
 */
const defaultConfig = () => ({
  ssr: {
    directives: {},
    server: null,
  },
  css: {
    extract: false,
    critical: false,
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
});

/**
 * Neue API to work with Vue CLI and Webpack
 */
class NeueApi {
  constructor(api) {
    this.api = api;
    this.nodeExternalsWhitelist = [];

    /**
     * Basic webpack conf for Neue
     */
    api.chainWebpack(config => {
      this.setupBaseConfig(config);
    });

    // ssr-core need to be transpiled
    api.service.projectOptions.transpileDependencies.push(
      /@vueneue(\\|\/)ssr-core/,
    );

    // Apollo whitelists
    if (api.hasPlugin('apollo')) {
      this.nodeExternalsWhitelist.push(/vue-apollo/, /vue-cli-plugin-apollo/);
    }
  }

  /**
   * Get config data or variable from neue.config.js
   */
  getConfig(selector) {
    let config = defaultConfig();

    // Load config in project if exists
    const configPath = this.api.resolve('neue.config.js');
    if (fs.existsSync(configPath)) {
      config = merge(config, require(configPath));
      // For HMR
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

  /**
   * Get absolute path to project
   */
  getProjectPath() {
    return this.api.service.context;
  }

  /**
   * Try to determine path and extension of a file
   */
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

  /**
   * Setup base configuration for SPA mode
   */
  setupBaseConfig(config) {
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
    config.plugin('neue-core').use(NeueCorePlugin, [{ api: this.api }]);

    // Add DefinePlugin
    config
      .plugin('neue-define')
      .use(webpack.DefinePlugin, [this.getDefineOptions()]);
  }

  /**
   * Get full webpack config for SSR
   */
  getWebpackConfig(options = {}) {
    const opts = Object.assign({ client: true, ssr: true }, options);
    const { client, ssr } = opts;

    const chainConfig = this.api.resolveChainableWebpackConfig();

    // Change template for HTMLWebpackPlugin
    let htmlOptions = {
      template: this.api.resolve(this.getConfig('templatePath')),
      filename: 'index.ssr.html',
    };

    // Override HTMLWebpackPlugin behavior
    chainConfig.plugin('html').tap(args => {
      const params = {
        ...(args[0].templateParameters || {}),
        neue: opts,
      };

      htmlOptions = {
        ...args[0],
        ...htmlOptions,
        inject: false,
        templateParameters: params,
      };

      return [htmlOptions];
    });

    // Add a index template for SPA pages
    chainConfig.plugin('html-spa').use(HtmlWebpack, [
      {
        ...htmlOptions,
        filename: 'index.spa.html',
        inject: true,
        templateParameters: {
          ...htmlOptions.templateParameters,
          neue: {
            ssr: false,
            client: true,
          },
        },
      },
    ]);

    // Remove dev plugins from @vue/cli-service
    chainConfig.plugins.delete('hmr');
    chainConfig.plugins.delete('no-emit-on-errors');
    chainConfig.plugins.delete('progress');

    // Friendly Errors with server URL
    chainConfig.plugin('friendly-errors').tap(args => {
      const messages = [];

      if (opts.host && opts.port) {
        const https = this.getConfig('ssr.https');
        const protocol = https && https.key && https.key ? 'https' : 'http';
        messages.push(
          `Server is running: ${protocol}://${opts.host}:${opts.port}`,
        );
      }

      args[0].compilationSuccessInfo = {
        messages,
      };
      return args;
    });

    // Webpack Bar config
    let webpackBarConfig = { name: 'Client', color: 'green' };

    // CSS handling
    this.handleCSS(chainConfig, opts);

    if (client) {
      /**
       * Client side
       */

      // Add Vue SSR plugin
      chainConfig
        .plugin('vue-ssr-client')
        .use(VueSSRClientPlugin, [{ filename: 'client-manifest.json' }]);
    } else {
      /**
       * Server side
       */

      // Change entry point
      chainConfig.entryPoints
        .get('app')
        .clear()
        .add(require.resolve('@vueneue/ssr-core/server'));

      // Add Vue SSR plugin
      chainConfig
        .plugin('vue-ssr-client')
        .use(VueSSRServerPlugin, [{ filename: 'server-bundle.json' }]);

      // Server needs
      chainConfig
        .target('node')
        .externals(
          nodeExternals({
            whitelist: [
              /\.css$/,
              /\?vue&type=style/,
              ...this.api.service.projectOptions.transpileDependencies,
              ...this.nodeExternalsWhitelist,
              ...(this.getConfig('nodeExternalsWhitelist') || []),
            ],
          }),
        )
        .output.filename('server-bundle.js')
        .libraryTarget('commonjs2');

      // Remove
      chainConfig.node.clear();
      chainConfig.optimization.splitChunks(false);
      chainConfig.performance.hints(false);
      chainConfig.performance.maxAssetSize(Infinity);

      // Change babel configs
      chainConfig.module.rules
        .get('js')
        .uses.get('babel-loader')
        .options({
          presets: [
            [
              '@vue/app',
              {
                targets: { node: 'current' },
                exclude: ['transform-regenerator'],
              },
            ],
          ],
        });

      // Webpack Bar config
      webpackBarConfig = { name: 'Server', color: 'orange' };
    }

    // Replace define plugin
    chainConfig.plugin('neue-define').tap(args => {
      args[0] = this.getDefineOptions({
        client,
        ssr: true,
      });
      return args;
    });

    // Add Webpack Bar
    chainConfig
      .plugin('webpack-bar')
      .use(WebpackBar, [webpackBarConfig])
      .before('vue-loader');

    let config = this.api.resolveWebpackConfig(chainConfig);

    /**
     * Change caches names for server side
     */
    if (ssr) {
      for (const rule of config.module.rules) {
        if (rule.use) {
          for (const item of rule.use) {
            if (item.loader === 'cache-loader' && !client) {
              // Change cache directory for server-side
              item.options.cacheIdentifier += '-server';
              item.options.cacheDirectory += '-server';
            } else if (item.loader === 'vue-loader') {
              // Optimize SSR only on server-side
              if (client) {
                item.options.optimizeSSR = false;
              } else {
                item.options.cacheIdentifier += '-server';
                item.options.cacheDirectory += '-server';
                item.options.optimizeSSR = true;
              }
            }
          }
        }
      }
    }

    return config;
  }

  /**
   * Get define options for VueNeue
   */
  getDefineOptions(options = {}) {
    const opts = Object.assign({ client: true, ssr: false }, options);
    const { client, ssr } = opts;

    return {
      'process.dev': process.env.NODE_ENV === 'production' ? 'false' : 'true',
      'process.prod': process.env.NODE_ENV === 'production' ? 'true' : 'false',
      'process.test': process.env.NODE_ENV === 'test' ? 'true' : 'false',
      'process.client': client ? 'true' : 'false',
      'process.server': client ? 'false' : 'true',
      'process.spa': ssr ? 'false' : 'true',
      'process.ssr': ssr ? 'true' : 'false',
    };
  }

  /**
   * Handle CSS configurations
   */
  handleCSS(chainConfig) {
    // CSS rules names
    const cssRulesNames = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus'];
    const oneOfsNames = [];

    // No extract: All CSS will be inlined
    if (!this.getConfig('css.extract')) {
      oneOfsNames.push('normal', 'normal-modules', 'vue', 'vue-modules');
    } else {
      oneOfsNames.push('vue', 'vue-modules');
    }

    // Replace extract css loader by vue style loader
    if (oneOfsNames.length) {
      for (const ruleName of cssRulesNames) {
        const rule = chainConfig.module.rules.get(ruleName);
        if (rule) {
          for (const oneOfName of oneOfsNames) {
            const oneOf = rule.oneOfs.get(oneOfName);
            if (oneOf) {
              const extractUse = oneOf.uses.get('extract-css-loader');
              if (extractUse) {
                oneOf.uses.delete('extract-css-loader');

                oneOf
                  .use('vue-style-loader')
                  .before('css-loader')
                  .loader('vue-style-loader')
                  .options({
                    sourceMap: false,
                    shadowMode: false,
                  });
              }
            }
          }
        }
      }
    }
  }
}

module.exports = NeueApi;
