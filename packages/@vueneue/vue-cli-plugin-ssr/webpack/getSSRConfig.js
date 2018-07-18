const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const WebpackBar = require('webpackbar');
const definePlugin = require('./definePlugin');

module.exports = (api, options = {}) => {
  const opts = Object.assign({ client: true, ssr: true }, options);
  const { client, ssr } = opts;

  const chainConfig = api.resolveChainableWebpackConfig();

  // Override HTMLWebpackPlugin behavior
  chainConfig.plugin('html').tap(args => {
    args[0].template = api.resolve(api.neue.templatePath);
    args[0].filename = 'index.ssr.html';
    return args;
  });

  // Remove dev plugins from @vue/cli-service
  chainConfig.plugins.delete('hmr');
  chainConfig.plugins.delete('no-emit-on-errors');
  chainConfig.plugins.delete('progress');

  // Disable CSS plugins on server side
  if (!client) {
    chainConfig.plugins.delete('optimize-css');
    chainConfig.plugins.delete('extract-css');

    const cssRulesNames = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus'];
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

  let config = api.resolveWebpackConfig(chainConfig);

  if (client) {
    config.entry = { app: [require.resolve('@vueneue/ssr-core/client')] };
    config = merge(config, {
      plugins: [
        new VueSSRClientPlugin({
          filename: 'client-manifest.json',
        }),
      ],
    });
  } else {
    config.entry = { app: [require.resolve('@vueneue/ssr-core/server')] };
    config = merge(config, {
      target: 'node',
      externals: nodeExternals({
        whitelist: [
          /\.css$/,
          /\?vue&type=style/,
          ...api.service.projectOptions.transpileDependencies,
        ],
      }),
      output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2',
      },
      plugins: [
        new VueSSRServerPlugin({
          filename: 'server-bundle.json',
        }),
      ],
    });

    if (config.optimization) {
      delete config.optimization.splitChunks;
    }
    delete config.node;
  }

  for (const index in config.plugins) {
    // Replace defines from SPA
    if (config.plugins[index].__vueneue) {
      config.plugins[index] = definePlugin({ client, ssr: true });
      config.plugins[index].__vueneue = true;
    }
  }

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

  let webpackBarConfig = {
    name: 'Client',
    color: 'green',
  };

  if (!client) {
    webpackBarConfig = {
      name: 'Server',
      color: 'orange',
    };
  }

  config.plugins.unshift(new WebpackBar(webpackBarConfig));

  return config;
};
