const execa = require('execa');

module.exports = async (name, preset, cwd) => {
  const cliBinPath = require.resolve('@vue/cli/bin/vue');

  const args = [
    'create',
    name,
    '--force',
    '--inlinePreset',
    JSON.stringify(preset),
    '--git',
    'false',
  ];

  return execa(cliBinPath, args, { cwd, stdio: 'inherit' });
};
