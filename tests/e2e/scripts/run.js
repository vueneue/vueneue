const execa = require('execa');
const waitOn = require('wait-on');

const waitOnPromise = options => {
  return new Promise(resolve => waitOn(options, resolve));
};

module.exports = async (projectPath, mode = 'open') => {
  const serve = execa('node_modules/.bin/vue-cli-service', ['ssr:serve'], {
    cwd: projectPath,
    stdio: 'inherit',
  });

  await waitOnPromise({
    resources: [`tcp:localhost:8080`],
    timeout: 60 * 1000,
  });

  const cypress = execa(
    'node_modules/.bin/cypress',
    ['--config', 'video=false', mode],
    {
      stdio: 'inherit',
    },
  );

  cypress.on('exit', exitCode => {
    serve.kill();
    process.exit(exitCode);
  });
};
