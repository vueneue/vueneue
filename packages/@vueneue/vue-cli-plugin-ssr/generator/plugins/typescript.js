module.exports = api => {
  // TypeScript support
  if (api.invoking && api.hasPlugin('@vue/cli-plugin-typescript')) {
    api.render('./typescript');

    /* eslint-disable-next-line node/no-extraneous-require */
    const convertFiles = require('@vue/cli-plugin-typescript/generator/convert');
    convertFiles(api);

    api.postProcessFiles(files => {
      for (const file in files) {
        if (/src\/main\./.test(file)) {
          files[file] = files[file].replace(
            /(createApp\s*\(\s*{[^}]*})(\s*\))/,
            `$1: any$2`,
          );
        }
      }
    });
  }
};
