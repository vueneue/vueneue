const SourceTranform = require('../SourceTransform');
const { getFilePath } = require('./utils');

module.exports = api => {
  if (api.hasPlugin('i18n')) {
    let mainPath = getFilePath(api, 'src/main');
    let i18nPath = getFilePath(api, 'src/i18n');

    // Post process files
    api.postProcessFiles(files => {
      // Change to i18n file
      if (files[i18nPath]) {
        const st = new SourceTranform(files[i18nPath]);
        st.replaceExportNewToArrow('VueI18n');

        files[i18nPath] = st.print();
      }

      // Change to main
      if (files[mainPath]) {
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
