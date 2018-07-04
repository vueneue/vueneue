const { readFileSync } = require('fs-extra');
const { join } = require('path');
const SourceTranform = require('../lib/SourceTransform');

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
    },
    devDependencies: {
      'webpack-node-externals': '^1.7.2',
      webpackbar: '^2.6.1',
    },
    scripts: {
      'ssr:serve': 'vue-cli-service ssr:serve',
      'ssr:build': 'vue-cli-service ssr:build',
      'ssr:start': 'vue-cli-service ssr:start',
    },
    vue: {
      pwa: {
        workboxOptions: {
          templatedUrls: {
            '/': 'index.ssr.html',
          },
        },
      },
    },
  };

  api.extendPackage(packageOverride);

  api.render('./template');

  if (options.docker) {
    api.render('./docker');
  }

  // TypeScript support
  if (api.invoking && api.hasPlugin('typescript')) {
    api.render('./typescript');

    /* eslint-disable-next-line node/no-extraneous-require */
    const convertFiles = require('@vue/cli-plugin-typescript/generator/convert');
    convertFiles(api);
  }

  // Post process files
  api.postProcessFiles(files => {
    // Transform existing files
    for (const file in files) {
      if (file.indexOf('src/router.') == 0) {
        // Router file
        const fileContent = files[file];
        const st = new SourceTranform(fileContent);
        st.removeImport('vue');
        st.removeVueUse('Router');
        st.replaceExportNewToArrow('Router');

        if (fileContent.indexOf('mode:') < 0)
          st.addToNew('Router', `mode: process.ssr ? 'history' : 'hash'`);

        files[file] = st.print();
      } else if (file.indexOf('src/store.') == 0) {
        // Store file
        const st = new SourceTranform(files[file]);
        st.removeImport('vue');
        st.removeVueUse('Vuex');
        st.replaceExportNewToArrow('Store');
        files[file] = st.print();
      } else if (file.indexOf('src/main.') == 0) {
        // Main file
        let fileContent = files[file];

        // initApp
        if (!/export\s(async\s)?function\sinitApp/.test(fileContent)) {
          fileContent += `\nexport async function initApp() {}`;
        }

        // PWA plugin
        if (api.hasPlugin('pwa')) {
          fileContent = fileContent.replace(
            `import './registerServiceWorker'`,
            `if (process.client) require('./registerServiceWorker')`,
          );
        }

        // Remove mount
        fileContent = fileContent.replace(/\.\$mount\([^)]*\)/, '');

        const st = new SourceTranform(fileContent);
        st.removeImport('./router');
        st.removeImport('./store');
        st.replaceVueCreation();

        files[file] = st.print();
      }
    }

    // Add missing files
    const filesExt = api.hasPlugin('typescript') ? 'ts' : 'js';
    if (!files[`src/router.${filesExt}`]) {
      files[`src/router.${filesExt}`] = readFileSync(
        join(__dirname, 'router.js'),
        'utf-8',
      );
    }

    if (!files[`src/store.${filesExt}`]) {
      files[`src/store.${filesExt}`] = readFileSync(
        join(__dirname, 'store.js'),
        'utf-8',
      );
    }
  });
};
