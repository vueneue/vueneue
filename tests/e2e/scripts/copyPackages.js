const fs = require('fs-extra');
const { resolve } = require('path');

const copyPackage = async (packageName, files, destPath) => {
  const packagePath = `packages/${packageName}`;
  for (const file of files) {
    await fs.copy(
      resolve(packagePath, file),
      `${destPath}/node_modules/${packageName}/${file}`,
    );
  }
};

module.exports = async destPath => {
  // Copy server
  await copyPackage('@vueneue/ssr-server', ['lib', 'package.json'], destPath);
  // Copy cli plugin
  await copyPackage(
    '@vueneue/vue-cli-plugin-ssr',
    ['lib', 'generator', 'ui', 'index.js', 'package.json'],
    destPath,
  );
};
