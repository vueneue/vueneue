/**
 * To execute this script you need
 * - npm i -g clinic
 * - npm i heapdump
 */

const execa = require('execa');
const autocannon = require('autocannon');
const http = require('http');

const httpBench = (path = '/') => {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:8080${path}`;

    console.log('Benchmarking: ' + path);
    autocannon(
      {
        url,
        duration: 5,
      },
      (err, results) => {
        if (err) return reject(err);

        console.log(`${results.requests.average} req/s`);
        resolve(results);
      },
    );
  });
};

const wait = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};

const heapdump = (name = '') => {
  return new Promise(resolve => {
    http.get('http://localhost:8080/heapdump?name=' + name, () => {
      resolve();
    });
  });
};

(async () => {
  // Build
  console.log('Building app...');
  await execa('./node_modules/.bin/vue-cli-service', ['ssr:build']);

  // Start node-clinic
  console.log('Starting server with node-clinic...');
  const clinic = execa('clinic', ['doctor', '--', 'node', 'start.js']);

  const routes = [
    { path: '/', heapdump: true },
    { path: '/async-data' },
    { path: '/async-data-error' },
    { path: '/async-data-store' },
    { path: '/nested' },
    { path: '/route-middleware' },
    { path: '/middleware-redirect' },
    { path: '/middleware-error' },
    { path: '/middleware-error-func', heapdump: true },
    // Next turn
    { path: '/', wait: 2000 },
    { path: '/async-data' },
    { path: '/async-data-error' },
    { path: '/async-data-store' },
    { path: '/nested' },
    { path: '/route-middleware' },
    { path: '/middleware-redirect' },
    { path: '/middleware-error' },
    { path: '/middleware-error-func', heapdump: true },
  ];

  // Add heapdump: true to route to create a heap snaphop after route execution

  // Autocannon
  for (const route of routes) {
    await httpBench(route.path);

    // if (route.heapdump) {
    //   console.log('Heapdump');
    //   await heapdump(route.path.replace(/\//, '-'));
    // }

    await wait(route.wait || 1000);
  }

  clinic.kill('SIGINT');
})().catch(err => console.error(err));
