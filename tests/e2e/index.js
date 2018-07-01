const argv = require('yargs').argv;
const fs = require('fs-extra');
const { join } = require('path');
const execa = require('execa');
const copyPackages = require('./scripts/copyPackages');
const invoke = require('./scripts/invoke');
const run = require('./scripts/run');

(async () => {
  const projectName = 'tests';
  const projectPath = join(__dirname, `../../packages/${projectName}`);

  // vue create
  if (!argv.quick) {
    await execa(join(__dirname, '../../init'), ['--tests'], {
      stdio: 'inherit',
    });
  }

  // ---/---

  // Copy mocks
  await fs.copy('tests/e2e/mocks', projectPath);

  // Use current sources to tests project
  await copyPackages(projectPath);

  if (argv.quick && argv.invoke) {
    // vue invoke
    await invoke(projectPath);
  }

  // Run server and start cypress
  await run(projectPath, argv.open ? 'open' : 'run');
})().catch(err => {
  console.error(err.stack || err.message || err);
});
