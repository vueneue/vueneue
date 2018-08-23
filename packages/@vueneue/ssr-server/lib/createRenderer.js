const { createBundleRenderer } = require('vue-server-renderer');
const lruCache = require('lru-cache');

module.exports = (bundle, options) => {
  options = Object.assign(
    {
      cache: lruCache({
        max: 1000,
        maxAge: 1000 * 60 * 15,
      }),
      runInNewContext: false,
    },
    options,
  );
  return createBundleRenderer(bundle, options);
};
