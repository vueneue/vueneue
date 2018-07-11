const { readFileSync } = require('fs-extra');
const { join } = require('path');

module.exports = (api, options) => {
  const packageOverride = {
    dependencies: {
      vuex: '^3.0.1',
      'vue-router': '^3.0.1',
      'vue-meta': '^1.5.0',
      'vue-class-component': '^6.2.0',
      'vue-property-decorator': '^6.1.0',
      'vuex-class': '^0.3.1',
      'vue-no-ssr': '^0.2.2',
      '@vueneue/ssr-server': '^0.2.0',
      '@vueneue/ssr-core': '^0.2.0',
    },
    devDependencies: {
      'webpack-node-externals': '^1.7.2',
      webpackbar: '^2.6.1',
    },
    scripts: {
      'ssr:serve': 'vue-cli-service ssr:serve',
      'ssr:build': 'vue-cli-service ssr:build',
      'ssr:start': 'vue-cli-service ssr:start',
      generate: 'vue-cli-service generate',
    },
    vue: {
      pluginOptions: {
        ssr: { server: null, directives: {} },
        generate: { scanRouter: true, params: {}, paths: [] },
        paths: {
          main: 'src/main',
          store: 'src/store',
          router: 'src/router',
          index: 'src/index.html',
        },
      },
      pwa: { workboxOptions: { templatedUrls: { '/': 'index.ssr.html' } } },
    },
  };

  api.extendPackage(packageOverride);

  api.render('./templates/base');

  // Docker option
  if (options.docker) {
    api.render('./templates/docker');
  }

  // Typescript plugin: inject definitions files
  if (api.invoking && api.hasPlugin('@vue/cli-plugin-typescript')) {
    api.render('./templates/typescript');
  }

  // Post process files
  api.postProcessFiles(async files => {
    // Transform existing files
    for (const file in files) {
      if (file.indexOf('src/router.') == 0) {
        files[file] = await require('./transform/router.js')(files[file]);
      } else if (file.indexOf('src/store.') == 0) {
        files[file] = await require('./transform/store.js')(files[file]);
      } else if (file.indexOf('src/main.') == 0) {
        files[file] = await require('./transform/main.js')(files[file]);
      }
    }

    // Add missing files
    const filesExt = api.hasPlugin('typescript') ? 'ts' : 'js';
    if (!files[`src/router.${filesExt}`]) {
      files[`src/router.${filesExt}`] = readFileSync(
        join(__dirname, 'templates/router.js'),
        'utf-8',
      );
    }

    if (!files[`src/store.${filesExt}`]) {
      files[`src/store.${filesExt}`] = readFileSync(
        join(__dirname, 'templates/store.js'),
        'utf-8',
      );
    }
  });

  // Plugins
  const cliPlugins = ['typescript', 'pwa', 'i18n'];
  for (const pluginName of cliPlugins) {
    require(`./plugins/${pluginName}`)(api);
  }
};
