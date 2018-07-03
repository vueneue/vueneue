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
  };

  api.extendPackage(packageOverride);

  api.render('./template');

  if (options.docker) {
    api.render('./docker');
  }

  let stParser = null;

  // TypeScript support
  if (api.invoking && api.hasPlugin('typescript')) {
    /* eslint-disable-next-line node/no-extraneous-require */
    const convertFiles = require('@vue/cli-plugin-typescript/generator/convert');
    convertFiles(api);

    // TODO: use ts parser for postProcessFiles
  }

  // Post process files
  api.postProcessFiles(files => {
    // Transform existing files
    for (const file in files) {
      if (file.indexOf('src/router.') == 0) {
        const fileContent = readFileSync(api.resolve(file));
        const st = new SourceTranform(fileContent, stParser);
        st.removeImport('vue');
        st.removeVueUse('Router');
        st.replaceExportNewToArrow('Router');

        if (fileContent.indexOf('mode:') < 0)
          st.addToNew('Router', `mode: process.ssr ? 'history' : 'hash'`);

        files[file] = st.print();
      } else if (file.indexOf('src/store.') == 0) {
        const st = new SourceTranform(
          readFileSync(api.resolve(file)),
          stParser,
        );
        st.removeImport('vue');
        st.removeVueUse('Vuex');
        st.replaceExportNewToArrow('Store');
        files[file] = st.print();
      }
    }

    // Add missing files

    // JavaScript
    if (!api.hasPlugin('typescript')) {
      if (!files['src/router.js']) {
        files['src/router.js'] = readFileSync(
          join(__dirname, 'router.js'),
          'utf-8',
        );
      }

      if (!files['src/store.js']) {
        files['src/store.js'] = readFileSync(
          join(__dirname, 'store.js'),
          'utf-8',
        );
      }

      // TypeScript
    } else {
      // TODO
    }
  });
};
