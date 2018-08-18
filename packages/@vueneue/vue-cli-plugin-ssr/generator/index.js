const { readFileSync } = require('fs-extra');
const { join } = require('path');
const Recast = require('../lib/recast');

module.exports = (api, options) => {
  const packageOverride = {
    dependencies: {
      vuex: '^3.0.1',
      'vue-router': '^3.0.1',
      'vue-meta': '^1.5.0',
      'vue-class-component': '^6.2.0',
      'vue-property-decorator': '^7.0.0',
      'vuex-class': '^0.3.1',
      'vue-no-ssr': '^0.2.2',
      '@vueneue/ssr-server': '^0.3.0',
      '@vueneue/ssr-core': '^0.3.0',
      'regenerator-runtime': '^0.12.1',
      'core-js': '^2.5.7',
    },
    scripts: {
      'ssr:serve': 'vue-cli-service ssr:serve',
      'ssr:build': 'vue-cli-service ssr:build',
      'ssr:start': 'vue-cli-service ssr:start',
      generate: 'vue-cli-service generate',
    },
    vue: {
      pwa: { workboxOptions: { templatedUrls: { '/': 'index.ssr.html' } } },
    },
  };

  // Base templates
  api.render('./templates/base');

  // Docker option
  if (api.invoking && options.docker) {
    api.render('./templates/docker');
  }

  // Typescript plugin: inject definitions files
  if (api.invoking && api.hasPlugin('@vue/cli-plugin-typescript')) {
    api.render('./templates/typescript');
  }

  // Post process files
  api.postProcessFiles(files => {
    // Transform existing files
    for (const file in files) {
      if (file.indexOf('src/router.') == 0) {
        // Router file
        const fileContent = files[file];
        const r = new Recast(fileContent);
        r.removeImport('vue')
          .removeVueUse('Router')
          .replaceExportNewToArrow('Router');

        if (fileContent.indexOf('mode:') < 0)
          r.addToNew('Router', `mode: process.ssr ? 'history' : 'hash'`);

        files[file] = r.print();
      } else if (file.indexOf('src/store.') == 0) {
        // Store file
        const r = new Recast(files[file]);
        r.removeImport('vue')
          .removeVueUse('Vuex')
          .replaceExportNewToArrow('Store');
        files[file] = r.print();
      } else if (file.indexOf('src/main.') == 0) {
        // Main file
        let fileContent = files[file];

        // Remove mount
        fileContent = fileContent.replace(/\.\$mount\([^)]*\)/, '');

        const r = new Recast(fileContent)
          .removeImport('./router')
          .removeImport('./store')
          .replaceVueCreation();

        files[file] = r.print();
      }
    }

    // Add missing files
    const filesExt = api.hasPlugin('typescript') ? 'ts' : 'js';
    if (!files[`src/router.${filesExt}`]) {
      files[`src/router.${filesExt}`] = readFileSync(
        join(__dirname, 'templates/router.js'),
        'utf-8',
      );

      // Add router to new Vue()
      const r = new Recast(files[`src/main.${filesExt}`]);
      r.addToNew('Vue', 'router');
      files[`src/main.${filesExt}`] = r.print();
    }

    if (!files[`src/store.${filesExt}`]) {
      files[`src/store.${filesExt}`] = readFileSync(
        join(__dirname, 'templates/store.js'),
        'utf-8',
      );

      // Add store to new Vue()
      const r = new Recast(files[`src/main.${filesExt}`]);
      r.addToNew('Vue', 'store');
      files[`src/main.${filesExt}`] = r.print();
    }
  });

  // Plugins
  const cliPlugins = ['typescript', 'pwa', 'i18n', 'apollo'];
  for (const pluginName of cliPlugins) {
    require(`./plugins/${pluginName}`)(api, packageOverride);
  }

  api.extendPackage(packageOverride);
};
