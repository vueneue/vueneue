module.exports = api => {
  const packageOverride = {
    dependencies: {
      vuex: '^3.0.1',
      'vue-router': '^3.0.1',
      'vue-meta': '^1.5.0',
      'vue-class-component': '^6.2.0',
      'vue-property-decorator': '^6.1.0',
      'vuex-class': '^0.3.1',
      'vue-no-ssr': '^0.2.2',
      '@vueneue/ssr-server': '^0.1.6',
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

  // TypeScript support
  if (api.invoking && api.hasPlugin('typescript')) {
    /* eslint-disable-next-line node/no-extraneous-require */
    const convertFiles = require('@vue/cli-plugin-typescript/generator/convert');
    convertFiles(api);
  }
};
