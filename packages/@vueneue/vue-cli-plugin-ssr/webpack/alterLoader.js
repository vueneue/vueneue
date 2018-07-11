module.exports = function(content, map, meta) {
  const callback = this.async();
  const { pluginOptions } = this.query.vueOptions;
  const { paths } = pluginOptions;

  content = content
    .replace('@/main', paths.main)
    .replace('@/store', paths.store)
    .replace('@/router', paths.router)
    .replace('@/middlewares', paths.middlewares);

  callback(null, content, map, meta);
};
