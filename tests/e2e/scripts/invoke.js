const fs = require('fs-extra');
const execa = require('execa');
const copyPackages = require('./copyPackages');

module.exports = async projectPath => {
  // Copy Vue CLI
  await fs.copy(
    'node_modules/@vue/cli',
    `${projectPath}/node_modules/@vue/cli`,
  );

  // Copy sources
  await copyPackages(projectPath);

  // Update project package
  const projectPackage = require(`${projectPath}/package.json`);
  projectPackage.dependencies['@vueneue/vue-cli-plugin-ssr'] = '^0.2.0';
  await fs.writeFile(
    `${projectPath}/package.json`,
    JSON.stringify(projectPackage, null, 2),
  );

  // Invoke cli plugin
  await execa(
    'node_modules/@vue/cli/bin/vue.js',
    ['invoke', '@vueneue/vue-cli-plugin-ssr'],
    {
      cwd: projectPath,
      stdio: 'inherit',
    },
  );
};
