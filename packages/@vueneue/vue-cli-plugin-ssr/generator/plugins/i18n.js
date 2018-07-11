const { getFilePath } = require('./utils');

module.exports = api => {
  if (api.hasPlugin('vue-cli-plugin-i18n')) {
    let mainPath = getFilePath(api, 'src/main');
    let i18nPath = getFilePath(api, 'src/i18n');

    // Post process files
    api.postProcessFiles(async files => {
      // Change to i18n file
      if (files[i18nPath]) {
        const { Recast, RQuery } = require('@vueneue/rquery');
        const doc = new RQuery.parse(files[i18nPath]);

        // Convert export to arrow function
        const lib = doc.find('exportDefault new#VueI18n')[0];
        lib.replace(`() => { return ${Recast.print(lib.node)}; }`);
        files[i18nPath] = await Recast.print(doc);
      }

      // Change to main
      if (files[mainPath]) {
        // TODO use RQuery
        files[mainPath] = files[mainPath].replace(
          `import i18n from './i18n'`,
          `import createI18n from './i18n'`,
        );

        files[mainPath] = files[mainPath].replace(
          `i18n,`,
          `i18n: createI18n(),`,
        );
      }
    });
  }
};
