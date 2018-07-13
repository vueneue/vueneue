const fs = require('fs-extra');
const { join } = require('path');
const ejs = require('ejs');

module.exports = async function(content, map, meta) {
  const callback = this.async();

  const { api } = this.query;
  const { plugins, paths, defaultPaths } = api.neue;

  /**
   * Replace paths
   */
  const relativePath = this.resourcePath.split('@vueneue/ssr-core/')[1];
  const replacePathsFiles = [
    'client/index.js',
    'server/index.js',
    'utils/createContext.js',
    'utils/middlewares.js',
  ];

  if (replacePathsFiles.indexOf(relativePath) >= 0) {
    for (const pathName in defaultPaths) {
      const originalPath = defaultPaths[pathName];
      const newPath = paths[pathName];
      content = content.replace(originalPath, newPath);
    }
  }

  /**
   * Plugins
   */
  if (relativePath === 'generated/plugins.js') {
    const template = await fs.readFile(
      join(__dirname, 'templates/plugins.ejs'),
      'utf-8',
    );

    content = ejs.render(template, {
      plugins,
    });
  }

  callback(null, content, map, meta);
};
