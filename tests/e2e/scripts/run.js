const execa = require('execa');
const waitOn = require('wait-on');
const argv = require('yargs').argv;

const waitOnPromise = options => {
  return new Promise(resolve => waitOn(options, resolve));
};

module.exports = async (projectPath, mode = 'open') => {
  let command = 'ssr:serve';
  if (argv.prod) {
    command = 'ssr:start';
    await execa('node_modules/.bin/vue-cli-service', ['ssr:build'], {
      cwd: projectPath,
      stdio: 'inherit',
    });
  }

  const serve = execa('node_modules/.bin/vue-cli-service', [command], {
    cwd: projectPath,
    stdio: 'inherit',
  });

  await waitOnPromise({
    resources: [`tcp:localhost:8080`],
    timeout: 60 * 1000,
  });

  const cypress = execa(
    'node_modules/.bin/cypress',
    [mode, '--config', 'video=false'],
    {
      stdio: 'inherit',
    },
  );

  cypress.on('exit', exitCode => {
    serve.kill();
    process.exit(exitCode);
  });
};
