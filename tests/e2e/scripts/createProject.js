const path = require('path');
const execa = require('execa');

module.exports = async (projectPath, preset) => {
  const cliBinPath = require.resolve('@vue/cli/bin/vue');

  const args = [
    'create',
    path.basename(projectPath),
    '--force',
    '--inlinePreset',
    JSON.stringify(preset),
    '--git',
    'false',
  ];

  return execa(cliBinPath, args, {
    cwd: path.dirname(projectPath),
    stdio: 'inherit',
  });
};
