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
    await execa('./init', ['--tests'], {
      stdio: 'inherit',
      cwd: join(__dirname, '../..'),
    });
  }

  // ---/---

  // Copy mocks
  await fs.copy(join(__dirname, 'mocks'), projectPath);

  if (argv.invoke) {
    // vue invoke
    await invoke(projectPath);
  }

  // Run server and start cypress
  if (!argv.noRun) await run(projectPath, argv.open ? 'open' : 'run');
})().catch(err => {
  console.error(err.stack || err.message || err);
  process.exit(1);
});
