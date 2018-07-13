module.exports = function(content, map, meta) {
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

  callback(null, content, map, meta);
};
