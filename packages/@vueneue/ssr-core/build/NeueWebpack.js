const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const nodeExternals = require('webpack-node-externals');
const WebpackBar = require('webpackbar');
const HtmlWebpack = require('html-webpack-plugin');

class NeueWebpack {
  constructor(neue) {
    this.neue = neue;
  }

  getConfig(options = {}) {
    const opts = Object.assign({ client: true, ssr: true }, options);
    const { client, ssr } = opts;

    const chainConfig = this.neue.api.resolveChainableWebpackConfig();

    // Change template for HTMLWebpackPlugin
    let htmlOptions = {
      template: this.neue.api.resolve(this.neue.getConfig('templatePath')),
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
        templateParameters: params,
      };

      return [htmlOptions];
    });

    // Add a index template for SPA pages
    if (this.neue.getConfig('spaPaths')) {
      chainConfig.plugin('html-spa').use(HtmlWebpack, [
        {
          ...htmlOptions,
          filename: 'index.spa.html',
          templateParameters: {
            ...htmlOptions.templateParameters,
            neue: {
              ssr: false,
              client: true,
            },
          },
        },
      ]);
    }

    // Remove dev plugins from @vue/cli-service
    chainConfig.plugins.delete('hmr');
    chainConfig.plugins.delete('no-emit-on-errors');
    chainConfig.plugins.delete('progress');

    // Disable CSS plugins on server side
    if (!client) {
      chainConfig.plugins.delete('optimize-css');
      chainConfig.plugins.delete('extract-css');

      const cssRulesNames = [
        'css',
        'postcss',
        'scss',
        'sass',
        'less',
        'stylus',
      ];
      const oneOfsNames = ['normal', 'normal-modules', 'vue', 'vue-modules'];

      for (const ruleName of cssRulesNames) {
        const rule = chainConfig.module.rules.get(ruleName);
        if (rule) {
          for (const oneOfName of oneOfsNames) {
            const oneOf = rule.oneOfs.get(oneOfName);
            if (oneOf) oneOf.uses.delete('extract-css-loader');
          }
        }
      }
    }

    // Friendly Errors with server URL
    chainConfig.plugin('friendly-errors').tap(args => {
      const messages = [];

      if (opts.host && opts.port) {
        const https = this.neue.getConfig('ssr.https');
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
              ...this.neue.api.service.projectOptions.transpileDependencies,
            ],
          }),
        )
        .output.filename('server-bundle.js')
        .libraryTarget('commonjs2');

      // Remove
      chainConfig.node.clear();
      chainConfig.optimization.splitChunks(false);

      // Webpack Bar config
      webpackBarConfig = { name: 'Server', color: 'orange' };
    }

    // Replace define plugin
    chainConfig.plugin('neue-define').tap(args => {
      args[0] = this.getDefine({
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

    let config = this.neue.api.resolveWebpackConfig(chainConfig);

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

  getDefine(options = {}) {
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
}

module.exports = NeueWebpack;
