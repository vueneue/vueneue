const { getFilePath } = require('./utils');

module.exports = api => {
  if (api.hasPlugin('@vue/cli-plugin-pwa')) {
    let mainPath = getFilePath(api, 'src/main');

    // Post process files
    api.postProcessFiles(files => {
      if (files[mainPath]) {
        files[mainPath] = files[mainPath].replace(
          `import './registerServiceWorker'`,
          `if (process.client) require('./registerServiceWorker')`,
        );
      }
    });
  }
};
