const fs = require('fs-extra');
const { join } = require('path');
const ejs = require('ejs');

module.exports = async function(content, map, meta) {
  this.cacheable(false);
  const callback = this.async();

  const relativePath = this.resourcePath.split('@vueneue/ssr-core/')[1];
  const { api } = this.query;
  const { plugins, paths, middlewares } = api.neue;

  if (relativePath === 'generated.js') {
    const data = {
      paths,
      middlewares,
      plugins,
    };

    const template = await fs.readFile(
      join(__dirname, 'templates/generated.ejs'),
      'utf-8',
    );
    content = ejs.render(template, data);

    console.log(content);
  }

  callback(null, content, map, meta);
};
