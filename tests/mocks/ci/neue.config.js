const fs = require('fs-extra');
const heapdump = require('heapdump');
const takeSnapshot = name => {
  return new Promise((resolve, reject) => {
    heapdump.writeSnapshot(
      `snapshots/${name}.heapsnapshot`,
      (err, filename) => {
        if (err) return reject(err);
        resolve(filename);
      },
    );
  });
};

module.exports = {
  ssr: {
    server(app) {
      fs.ensureDirSync('snapshots');

      app.use(async (ctx, next) => {
        if (/^\/heapdump/.test(ctx.url)) {
          await takeSnapshot(ctx.query.name || new Date().getTime());
          ctx.body = 'ok';
        } else {
          await next();
        }
      });
    },
  },
  middlewares: {
    child: '@/middlewares/child',
    error: '@/middlewares/error',
    errorFunc: '@/middlewares/errorFunc',
    parent: '@/middlewares/parent',
    store: '@/middlewares/store',
    redirect: '@/middlewares/redirect',
    global: '@/middlewares/global',
  },
  plugins: { tests: '@/plugins/tests' },
};
