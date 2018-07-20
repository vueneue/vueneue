const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');

module.exports = async function(content, map, meta) {
  this.cacheable(false);
  const callback = this.async();

  const relativePath = this.resourcePath.split(
    `@vueneue${path.sep}ssr-core${path.sep}`,
  )[1];
  const { api } = this.query;
  const { plugins, paths } = api.neue.getConfig();

  if (relativePath === 'generated.js') {
    const template = await fs.readFile(
      path.join(__dirname, 'templates/generated.ejs'),
      'utf-8',
    );

    content = ejs.render(template, {
      paths,
      plugins,
    });
  }

  callback(null, content, map, meta);
};
